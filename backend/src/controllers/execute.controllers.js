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
    const resultsWithExpectedOutput = results.map((result, index) => ({
      ...result,
      expected_output: submissions[index].expected_output
    }));
    
    for (let i = 0; i < resultsWithExpectedOutput.length; i++) {
      const result = resultsWithExpectedOutput[i];
      console.log(`Result for example ${i + 1}: ${JSON.stringify(result, null, 2)}`);
    }
    return res.status(200).json(
      new ApiResponse(200, `Successfully ran code for all examples`, { results:resultsWithExpectedOutput })
    );
  });


  export const submit = asyncHandler(async (req, res) => {
    const { languageId, problemId, sourceCode } = req.body;
    const userId = req.user.id;
  
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
  
    const submissionResults = await submitBatch(allSubmissions);
    const tokens = submissionResults.map((item) => item.token);
    const results = await pollBatchResults(tokens);
  
    // Example Results
    const exampleResultsRaw = results.slice(0, exampleSubmissions.length);
    const exampleResults = exampleResultsRaw.map((r, index) => ({
      testCase: index + 1,
      passed: r.status.id === 3,
      stdout: r.stdout || '',
      expectedOutput: problem.examples[index].output,
      stderr: r.stderr || '',
      compileOutput: r.compile_output || '',
      status: r.status.description,
      memory: r.memory?.toString() || '',
      time: r.time?.toString() || '',
    }));
  
    const exampleAllPassed = exampleResults.every((r) => r.passed);
  
    // Testcase Results
    const testcaseResultsRaw = results.slice(exampleSubmissions.length);
    const testcaseResults = testcaseResultsRaw.map((r, index) => ({
      testCase: index + 1,
      passed: r.status.id === 3,
      stdout: r.stdout || '',
      expectedOutput: problem.testcases[index].output,
      stderr: r.stderr || '',
      compileOutput: r.compile_output || '',
      status: r.status.description,
      memory: r.memory?.toString() || '',
      time: r.time?.toString() || '',
    }));
  
    const testcasesPassed = testcaseResults.every((r) => r.passed);
  
    // Average time and memory if passed
    let averageTime = '';
    let averageMemory = '';
  
    if (testcasesPassed) {
      const totalTime = testcaseResultsRaw.reduce((sum, r) => sum + (parseFloat(r.time) || 0), 0);
      const totalMemory = testcaseResultsRaw.reduce((sum, r) => sum + (parseInt(r.memory) || 0), 0);
      averageTime = (totalTime / testcaseResultsRaw.length).toFixed(3);
      averageMemory = Math.round(totalMemory / testcaseResultsRaw.length).toString();
    }
  
    // Create submission record
    const newSubmission = await prisma.submissions.create({
      data: {
        userId,
        problemId,
        sourcCode: {
          code: sourceCode,
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
  
    const testcasesToCreate = testcaseResults.map((result) => ({
      submissionId: newSubmission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expectedOutput: result.expectedOutput,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));
  
    await prisma.testcases.createMany({ data: testcasesToCreate });
  
    if (testcasesPassed) {
      await prisma.solvedProblem.upsert({
        where: {
          userId_problemId: { userId, problemId },
        },
        update: {},
        create: { userId, problemId },
      });
    }
  
    return res.status(200).json(
      new ApiResponse(200, `Submission processed`, {
        submissionId: newSubmission.id,
        newSubmission,
        exampleResults,
        exampleAllPassed,
        testcaseResults,
        testcasesPassed,
      })
    );
  });
  
  