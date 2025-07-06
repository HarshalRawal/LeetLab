"use client"

import { motion } from "motion/react"

const ProblemDescription = ({ problem }) => {
  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{problem.description}</p>
        </motion.div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-sm font-medium text-orange-400 mb-3">Example {index + 1}:</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-400">Input: </span>
                      <code className="text-sm text-white bg-gray-800/50 px-2 py-1 rounded">{example.input}</code>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Output: </span>
                      <code className="text-sm text-white bg-gray-800/50 px-2 py-1 rounded">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-sm font-medium text-gray-400">Explanation: </span>
                        <span className="text-sm text-gray-300">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Constraints */}
        {problem.constraints && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Constraints</h3>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              {Array.isArray(problem.constraints) ? (
                <ul className="space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-sm text-gray-300 font-mono">
                      • {constraint}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-300 font-mono">{problem.constraints}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Additional Information from Backend */}
        {(problem.expectedTimeComplexity || problem.expectedTimeLimit || problem.expectedMemoryLimit) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {problem.expectedTimeComplexity && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Expected Time Complexity</h4>
                  <code className="text-white font-mono text-sm">{problem.expectedTimeComplexity}</code>
                </div>
              )}
              {problem.expectedTimeLimit && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Time Limit</h4>
                  <code className="text-white font-mono text-sm">{problem.expectedTimeLimit}s</code>
                </div>
              )}
              {problem.expectedMemoryLimit && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Memory Limit</h4>
                  <code className="text-white font-mono text-sm">{problem.expectedMemoryLimit}KB</code>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Hints (if available) */}
        {problem.hints && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Hints</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 text-sm">{problem.hints}</p>
            </div>
          </motion.div>
        )}

        {/* Add some bottom padding for better scrolling */}
        <div className="h-6"></div>
      </div>
    </div>
  )
}

export default ProblemDescription
