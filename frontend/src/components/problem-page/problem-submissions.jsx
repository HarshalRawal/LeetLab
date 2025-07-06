"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle, Code, Calendar, Loader2 } from "lucide-react"
import { useProblemStore } from "../../Store/useProblemStore"

const ProblemSubmissions = ({ problem }) => {
  const { submissions, isSubmissionsLoading, getSubmissionsByProblemId } = useProblemStore()
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  // Load submissions when component mounts
  useEffect(() => {
    if (problem?.id) {
      getSubmissionsByProblemId(problem.id)
    }
  }, [problem?.id, getSubmissionsByProblemId])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "wrong answer":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "time limit exceeded":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "runtime error":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "wrong answer":
      case "time limit exceeded":
      case "runtime error":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (isSubmissionsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
          <span className="text-gray-400">Loading submissions...</span>
        </div>
      </div>
    )
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Submissions Yet</h3>
          <p className="text-gray-400">Your submissions will appear here after you submit your code.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Your Submissions</h3>
          <span className="text-sm text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
            {submissions.length} submissions
          </span>
        </div>

        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                selectedSubmission?.id === submission.id
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {submission.runtime || "N/A"}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{submission.language}</span>
                </div>
              </div>

              {/* Expanded view */}
              {selectedSubmission?.id === submission.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-600/30 pt-4 mt-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">Submitted Code</span>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{submission.code}</pre>
                  </div>

                  {submission.testResults && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white mb-2">Test Results</h4>
                      <div className="text-sm text-gray-400">
                        Passed: {submission.testResults.passed}/{submission.testResults.total} test cases
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add some bottom padding for better scrolling */}
        <div className="h-6"></div>
      </div>
    </div>
  )
}

export default ProblemSubmissions
