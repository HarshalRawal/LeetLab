import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import prisma from "../db/index.js";
import { getJudge0LanguageFromId,singleSubmission,submitBatch,pollBatchResults,pollSingleResult } from "../utils/judge0-api.js";

export const run = asyncHandler(async (req, res) => {
    const { languageId, problemId, sourceCode, customInputs } = req.body;
  
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        referenceSolutions: true,
        examples: true,
        expectedTimeLimit: true,
        expectedMemoryLimit: true
      }
    });
  
    if (!problem) {
      throw new ApiError(404, `Problem with id ${problemId} not found`);
    }
  
    const language = getJudge0LanguageFromId(languageId);
    const referenceSolutions = problem.referenceSolutions;
    const examples = problem.examples;
  
    const languageReferenceSolution = referenceSolutions[language.toUpperCase()];
  
    let customExpectedOutput;
  
    if (customInputs) {
      const customInputsSubmission = {
        source_code: languageReferenceSolution,
        language_id: languageId,
        stdin: customInputs
      };
  
      const { token } = await singleSubmission(customInputsSubmission);
      const result = await pollSingleResult(token);
      customExpectedOutput = result.stdout;
    }
  
    let submissions = examples.map(({ input, output }) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
      cpu_time_limit: problem.expectedTimeLimit,
      memory_limit: problem.expectedMemoryLimit
    }));
  
    if (customInputs) {
      submissions.push({
        source_code: sourceCode,
        language_id: languageId,
        stdin: customInputs,
        expected_output: customExpectedOutput,
        cpu_time_limit: problem.expectedTimeLimit,
        memory_limit: problem.expectedMemoryLimit
      });
    }
  
    const submissionResults = await submitBatch(submissions);
    const tokens = submissionResults.map((obj) => obj.token);
    const results = await pollBatchResults(tokens);
  
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log(`Result for example ${i + 1}: ${JSON.stringify(result, null, 2)}`);
      if (result.status.id !== 3) {
        throw new ApiError(400, `Example ${i + 1} failed for language ${language}`);
      }
    }
  
    return res.status(200).json(
      new ApiResponse(200, `Successfully ran code for all examples`, { results })
    );
  });


  export const submit = asyncHandler(async (req, res) => {
    const { languageId, problemId, sourceCode } = req.body;
    const userId = req.user.id; // assuming auth middleware sets this
  
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        testcases: true,
        examples: true,
        referenceSolutions: true,
        expectedTimeLimit: true,
        expectedMemoryLimit: true,
      },
    });
  
    if (!problem) {
      throw new ApiError(404, `Problem with id ${problemId} not found`);
    }
  
    const language = getJudge0LanguageFromId(languageId);
  
    // Construct example & testcase submissions
    const exampleSubmissions = problem.examples.map(({ input, output }) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
      cpu_time_limit: problem.expectedTimeLimit,
      memory_limit: problem.expectedMemoryLimit,
    }));
  
    const testcaseSubmissions = problem.testcases.map(({ input, output }) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
      cpu_time_limit: problem.expectedTimeLimit,
      memory_limit: problem.expectedMemoryLimit,
    }));
  
    const allSubmissions = [...exampleSubmissions, ...testcaseSubmissions];
  
    // Submit all to Judge0
    const submissionResults = await submitBatch(allSubmissions);
    const tokens = submissionResults.map((item) => item.token);
    const results = await pollBatchResults(tokens);
  
    // Check examples (first N results)
    const exampleResults = results.slice(0, exampleSubmissions.length);
    const exampleAllPassed = exampleResults.every((r) => r.status.id === 3);
  
    // Testcase results (stored in DB)
    const testcaseResults = results.slice(exampleSubmissions.length);
    const testcasesPassed = testcaseResults.every((r) => r.status.id === 3);
  
    // Create submission entry regardless of pass/fail

    let averageTime = '';
    let averageMemory = '';
    if (testcasesPassed) {
      const totalTime = testcaseResults.reduce((sum, r) => sum + (parseFloat(r.time) || 0), 0);
      const totalMemory = testcaseResults.reduce((sum, r) => sum + (parseInt(r.memory) || 0), 0);
      averageTime = (totalTime / testcaseResults.length).toFixed(3);
      averageMemory = Math.round(totalMemory / testcaseResults.length).toString();
    }
  
    console.log(`SOURCE CODE : ${sourceCode}`)
    const newSubmission = await prisma.submissions.create({
      data: { 
        userId,
        problemId,
        sourcCode: {
          code :sourceCode
        },
        language,
        stdin: null,
        stdout: null,
        stderr: null,
        compileOutput: null,
        status: testcasesPassed ? 'Success' : 'Failed',
        memory: averageTime,
        time: averageMemory,
      },
    });
  
    
    const testcasesToCreate = testcaseResults.map((result, index) => ({
      submissionId: newSubmission.id,
      testCase: index + 1,
      passed: result.status.id === 3,
      stdout: result.stdout || '',
      expectedOutput: problem.testcases[index].output,
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      status: result.status.description,
      memory: result.memory?.toString() || '',
      time: result.time?.toString() || '',
    }));
  
    await prisma.testcases.createMany({ data: testcasesToCreate });
  
    // If all testcases passed, mark as solved
    if (testcasesPassed) {
      await prisma.solvedProblem.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }
  
    return res.status(200).json(
      new ApiResponse(200, `Submission processed`, {
        submissionId: newSubmission.id,
        newSubmission:newSubmission,
        examplePassed: exampleAllPassed,
        exampleResults:exampleResults,
        testcasesPassed,
        testcaseResults,
      })
    );
  });
  
  