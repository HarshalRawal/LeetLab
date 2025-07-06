"use client"

import { motion } from "motion/react"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

const TestResults = ({ results, isRunning }) => {
  if (isRunning) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-700/20">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
          <span className="text-gray-400">Running test cases...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-700/20">
      <div className="p-4 border-b border-gray-600/30">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Test Results
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg border ${
              result.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              {result.passed ? (
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">Test Case {index + 1}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <code className="text-gray-300 bg-gray-800/50 px-1 rounded">{result.input}</code>
                  </div>
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <code className="text-gray-300 bg-gray-800/50 px-1 rounded">{result.output}</code>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected: </span>
                    <code className="text-gray-300 bg-gray-800/50 px-1 rounded">{result.expected}</code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TestResults
