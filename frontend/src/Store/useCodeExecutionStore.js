import { create } from "zustand"
import { axiosInstance } from "../libs/axios"
import { toast } from "react-toastify"

export const useCodeExecutionStore = create((set, get) => ({
  // State
  isRunning: false,
  isSubmitting: false,
  runResults: [],
  submitResults: [],
  lastRunTime: null,
  lastSubmitTime: null,
  error: null,

  // Run code against examples
  runCode: async (sourceCode, languageId, problemId, problemData = null) => {
    try {
      set({ isRunning: true, error: null, runResults: [] })

      console.log("Running code with params:", { sourceCode, languageId, problemId })

      const response = await axiosInstance.post("/execute/run", {
        sourceCode,
        languageId,
        problemId,
      })

      console.log("Run API Response:", response.data)

      if (response.data.success && response.data.data?.results) {
        const transformedResults = transformRunResults(response.data.data.results, problemId, problemData)

        set({
          isRunning: false,
          runResults: transformedResults,
          lastRunTime: new Date().toISOString(),
          error: null,
        })

        toast.success(response.data.message || "Code executed successfully!")
        return transformedResults
      } else {
        throw new Error(response.data.message || "Failed to run code")
      }
    } catch (error) {
      console.error("Error running code:", error)

      const errorMessage = error.response?.data?.message || error.message || "Failed to run code"

      set({
        isRunning: false,
        runResults: [],
        error: errorMessage,
      })

      toast.error(errorMessage)
      throw error
    }
  },

  // Submit code for evaluation (placeholder for now)
  submitCode: async (sourceCode, languageId, problemId, problemData = null) => {
    try {
      set({ isSubmitting: true, error: null, submitResults: [] })

      console.log("Submitting code with params:", { sourceCode, languageId, problemId })

      const response = await axiosInstance.post("/execute/submit", {
        sourceCode,
        languageId,
        problemId,
      })

      console.log("Submit API Response:", response.data)

      if (response.data.success && response.data.data) {
        const { exampleResults, testcaseResults, exampleAllPassed, testcasesPassed, newSubmission } = response.data.data

        // Transform the results to match UI expectations
        const transformedResults = transformSubmissionResults(
          exampleResults,
          testcaseResults,
          exampleAllPassed,
          testcasesPassed,
          problemData
        )

        set({
          isSubmitting: false,
          submitResults: transformedResults,
          lastSubmitTime: new Date().toISOString(),
          error: null,
        })

        // Show appropriate success/failure message
        if (exampleAllPassed && testcasesPassed) {
          toast.success("All test cases passed! Solution accepted.")
        } else if (exampleAllPassed && !testcasesPassed) {
          toast.error("Examples passed but some test cases failed.")
        } else {
          toast.error("Some examples failed. Please check your solution.")
        }

        return {
          ...transformedResults,
          allPassed: exampleAllPassed && testcasesPassed,
          examplesPassed: exampleAllPassed,
          testcasesPassed: testcasesPassed,
          submission: newSubmission,
        }
      } else {
        throw new Error(response.data.message || "Failed to submit code")
      }
    } catch (error) {
      console.error("Error submitting code:", error)

      const errorMessage = error.response?.data?.message || error.message || "Failed to submit code"

      set({
        isSubmitting: false,
        submitResults: [],
        error: errorMessage,
      })

      toast.error(errorMessage)
      throw error
    }
  },

  // Clear results
  clearResults: () => {
    set({
      runResults: [],
      submitResults: [],
      error: null,
    })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Reset store
  resetStore: () => {
    set({
      isRunning: false,
      isSubmitting: false,
      runResults: [],
      submitResults: [],
      lastRunTime: null,
      lastSubmitTime: null,
      error: null,
    })
  },
}))

// Helper function to transform run results to match UI expectations
const transformRunResults = (apiResults, problemId, problemData) => {
  return apiResults.map((result, index) => {
    const isAccepted = result.status?.id === 3 || result.status?.description === "Accepted"

    // Get the actual input from problem examples if available
    const actualInput =
      problemData?.examples?.[index]?.input || problemData?.testCases?.[index]?.input || `Example ${index + 1} input`

    return {
      id: result.token || `run-${index}`,
      input: actualInput,
      output: result.stdout?.trim() || "",
      expected: result.expected_output?.trim() || result.stdout?.trim() || "", // Use expected_output from API
      passed: isAccepted,
      runtime: result.time ? `${Number.parseFloat(result.time * 1000).toFixed(0)} ms` : "0 ms",
      memory: result.memory ? `${(result.memory / 1024).toFixed(1)} MB` : "0 MB",
      isExample: true,
      status: result.status?.description || "Unknown",
      stderr: result.stderr,
      compile_output: result.compile_output,
      message: result.message,
      token: result.token,
      // Store original API response for debugging
      originalResponse: result,
    }
  })
}

// Helper function to transform submit results (for future use)
const transformSubmissionResults = (exampleResults, testcaseResults, exampleAllPassed, testcasesPassed, problemData) => {
  const allResults = []

  // Transform example results
  if (exampleResults && exampleResults.length > 0) {
    exampleResults.forEach((result, index) => {
      const actualInput = problemData?.examples?.[index]?.input || `Example ${index + 1} input`
      
      allResults.push({
        id: `example-${index}`,
        type: 'example',
        testCaseNumber: index + 1,
        input: actualInput,
        output: result.stdout?.trim() || "",
        expected: result.expectedOutput?.trim() || "",
        passed: result.passed,
        runtime: result.time ? `${Number.parseFloat(result.time * 1000).toFixed(0)} ms` : "0 ms",
        memory: result.memory ? `${(result.memory / 1024).toFixed(1)} MB` : "0 MB",
        isExample: true,
        status: result.status || (result.passed ? "Accepted" : "Wrong Answer"),
        stderr: result.stderr || "",
        compile_output: result.compileOutput || "",
        originalResponse: result,
      })
    })
  }

  // Transform test case results
  if (testcaseResults && testcaseResults.length > 0) {
    testcaseResults.forEach((result, index) => {
      const actualInput = problemData?.actualTestCases?.[index]?.input || `Test case ${index + 1} input`
      
      allResults.push({
        id: `testcase-${index}`,
        type: 'testcase',
        testCaseNumber: index + 1,
        input: actualInput,
        output: result.stdout?.trim() || "",
        expected: result.expectedOutput?.trim() || "",
        passed: result.passed,
        runtime: result.time ? `${Number.parseFloat(result.time * 1000).toFixed(0)} ms` : "0 ms",
        memory: result.memory ? `${(result.memory / 1024).toFixed(1)} MB` : "0 MB",
        isExample: false,
        status: result.status || (result.passed ? "Accepted" : "Wrong Answer"),
        stderr: result.stderr || "",
        compile_output: result.compileOutput || "",
        originalResponse: result,
      })
    })
  }

  return {
    results: allResults,
    summary: {
      examplesPassed: exampleAllPassed,
      testcasesPassed: testcasesPassed,
      allPassed: exampleAllPassed && testcasesPassed,
      totalExamples: exampleResults?.length || 0,
      passedExamples: exampleResults?.filter(r => r.passed).length || 0,
      totalTestcases: testcaseResults?.length || 0,
      passedTestcases: testcaseResults?.filter(r => r.passed).length || 0,
    }
  }
}
// Language ID mapping helper
export const getLanguageId = (language) => {
  const languageMap = {
    javascript: 63, // Node.js
    python: 71, // Python 3
    java: 62, // Java
    cpp: 54, // C++
    c: 50, // C
  }

  return languageMap[language.toLowerCase()] || 63 // Default to JavaScript
}
