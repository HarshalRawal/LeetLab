import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useProblemStore } from "../Store/useProblemStore" // Fixed import path
import ProblemPage from "../components/problem-page/problem-page"

export default function ProblemDetailPage() {
  const { id } = useParams()
  const { problem, isProblemLoading, getProblemById } = useProblemStore()

  // Load problem data from backend
  useEffect(() => {
    if (id) {
      console.log("Loading problem with ID:", id) // Debug log
      getProblemById(id)
    }
  }, [id, getProblemById])

  // Debug logs
  useEffect(() => {
    console.log("Problem loading state:", isProblemLoading)
    console.log("Problem data:", problem)
  }, [isProblemLoading, problem])

  // Transform backend data to match component expectations
  const transformProblemData = (backendProblem) => {
    if (!backendProblem) {
      console.log("No backend problem data");
      return null;
    }
  
    console.log("Transforming problem data:", backendProblem);
  
    // Convert examples to test case format for initial display
    const exampleTestCases =
      backendProblem.examples?.map((example, index) => ({
        id: `example-${index}`,
        input: example.input || "",
        output: example.output || "",
        expected: example.output || "",
        isExample: true,
      })) || [];
  
    // Convert actual test cases (used for submission)
    const actualTestCases =
      backendProblem.testcases?.map((tc, index) => ({
        id: `test-${index}`,
        input: tc.input || "",
        output: tc.output || "",
        expected: tc.output || "",
        isExample: false,
      })) || [];
  
    // Safe defensive copy of code snippets
    const codeSnippets = {
      javascript: backendProblem.codeSnippets?.JAVASCRIPT || "// Write your solution here",
      python: backendProblem.codeSnippets?.PYTHON || "# Write your solution here",
      java: backendProblem.codeSnippets?.JAVA || "// Write your solution here",
    };
  
    // If last submission exists, override code snippet for that language
    if (backendProblem.lastSubmission?.sourcCode?.code && backendProblem.lastSubmission?.language) {
      const lang = backendProblem.lastSubmission.language.toLowerCase();
      if (codeSnippets[lang] !== undefined) {
        codeSnippets[lang] = backendProblem.lastSubmission.sourcCode.code;
      }
    }
  
    const transformedData = {
      id: backendProblem.id,
      title: backendProblem.title || "Untitled Problem",
      difficulty: backendProblem.difficulty || "Easy",
      description: backendProblem.description || "No description available",
      examples: backendProblem.examples || [],
      solved: backendProblem.solved,
      solvedBy : backendProblem._count.solvedBy,
      constraints: Array.isArray(backendProblem.constraints)
        ? backendProblem.constraints
        : backendProblem.constraints
          ? [backendProblem.constraints]
          : ["No constraints specified"],
      tags: backendProblem.tags || [],
      acceptance: "N/A",
      submissions: backendProblem._count?.solvedBy || 0,
      codeSnippets,
      testCases: exampleTestCases,
      actualTestCases,
      hints: backendProblem.hints,
      editorial: backendProblem.editorial,
      expectedTimeComplexity: backendProblem.expectedTimeComplexity,
      maxInputSize: backendProblem.maxInputSize,
      expectedTimeLimit: backendProblem.expectedTimeLimit,
      expectedMemoryLimit: backendProblem.expectedMemoryLimit,
      referenceSolutions: {
        javascript: backendProblem.referenceSolutions?.JAVASCRIPT || "",
        python: backendProblem.referenceSolutions?.PYTHON || "",
        java: backendProblem.referenceSolutions?.JAVA || "",
      },
    };
  
    console.log("Transformed problem data:", transformedData);
    return transformedData;
  };
  

  if (isProblemLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <span className="ml-3 text-gray-400">Loading problem...</span>
      </div>
    )
  }

  if (!problem && !isProblemLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Problem Not Found</h2>
          <p className="text-gray-400 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
          <a
            href="/problems"
            className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
          >
            Back to Problems
          </a>
        </div>
      </div>
    )
  }

  const transformedProblem = transformProblemData(problem)

  if (!transformedProblem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Problem</h2>
          <p className="text-gray-400 mb-6">There was an issue loading the problem data.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 mr-4"
          >
            Retry
          </button>
          <a
            href="/problems"
            className="btn bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30"
          >
            Back to Problems
          </a>
        </div>
      </div>
    )
  }

  return <ProblemPage problem={transformedProblem} />
}
