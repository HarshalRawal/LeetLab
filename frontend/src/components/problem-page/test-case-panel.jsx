"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, X, Play, Clock, Database, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"

const TestCasePanel = ({ results, isRunning, onClose, problem }) => {
  const [activeTab, setActiveTab] = useState("testcase")
  const [selectedCase, setSelectedCase] = useState(0)
  const [showActualTestCases, setShowActualTestCases] = useState(false)

  const tabs = [
    { id: "testcase", label: "Testcase" },
    { id: "result", label: "Test Result" },
  ]

  // Determine which test cases to show
  const getDisplayCases = () => {
    if (results.length > 0) {
      return results // Show results when available
    }

    // Show examples by default (like LeetCode), but allow switching to actual test cases
    if (showActualTestCases && problem?.actualTestCases?.length > 0) {
      return problem.actualTestCases
    }

    // Default to showing examples as test cases
    return problem?.testCases || []
  }

  const displayCases = getDisplayCases()

  // Get overall status for results
  const getOverallStatus = () => {
    if (results.length === 0) return null

    const allPassed = results.every((r) => r.passed)
    const passedCount = results.filter((r) => r.passed).length
    const totalCount = results.length

    return {
      allPassed,
      passedCount,
      totalCount,
      status: allPassed ? "Accepted" : "Wrong Answer",
      runtime: results[0]?.runtime || "0 ms",
      memory: results[0]?.memory || "0 MB",
    }
  }

  const overallStatus = getOverallStatus()

  const renderTestCaseTab = () => (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Results Header - Only show when we have results */}
      {overallStatus && (
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-semibold ${overallStatus.allPassed ? "text-green-400" : "text-red-400"}`}>
                {overallStatus.status}
              </span>
            </div>
            <div className="text-gray-400 text-sm">Runtime: {overallStatus.runtime}</div>
          </div>
        </div>
      )}

      {/* Case Selector */}
      {displayCases.length > 0 && (
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-700/30">
          <div className="flex items-center gap-2">
            {displayCases.map((testCase, index) => {
              const result = results[index]
              const isPassed = result?.passed
              const hasDot = results.length > 0 // Only show dots when we have results

              return (
                <button
                  key={index}
                  onClick={() => setSelectedCase(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCase === index
                      ? "bg-gray-700/50 text-white border border-gray-600/50"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/30 hover:text-gray-300"
                  }`}
                >
                  {hasDot && <div className={`w-2 h-2 rounded-full ${isPassed ? "bg-green-400" : "bg-red-400"}`} />}
                  Case {index + 1}
                </button>
              )
            })}
          </div>

          {/* Toggle between examples and actual test cases (only when no results) */}
          {results.length === 0 && problem?.actualTestCases?.length > 0 && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {showActualTestCases
                    ? `Showing ${displayCases.length} test cases`
                    : `Showing ${displayCases.length} examples`}
                </span>
                {!showActualTestCases && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                    Examples
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowActualTestCases(!showActualTestCases)}
                className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-700/30 hover:bg-gray-600/30 text-gray-400 hover:text-white rounded transition-colors"
                title={showActualTestCases ? "Show Examples" : "Show All Test Cases"}
              >
                {showActualTestCases ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showActualTestCases ? "Examples" : "All Cases"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Test Case Content - Scrollable with visible scrollbar */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-6 py-4 space-y-6">
          {displayCases.length > 0 && displayCases[selectedCase] && (
            <>
              {/* Input Section */}
              <div>
                <h4 className="text-gray-400 text-sm font-medium mb-3">Input</h4>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <code className="text-white font-mono text-sm whitespace-pre-wrap">
                    {displayCases[selectedCase].input}
                  </code>
                </div>
              </div>

              {/* Output Section */}
              <div>
                <h4 className="text-gray-400 text-sm font-medium mb-3">
                  {results.length > 0 ? "Output" : "Expected Output"}
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <code className="text-white font-mono text-sm whitespace-pre-wrap">
                    {results.length > 0
                      ? displayCases[selectedCase].output
                      : displayCases[selectedCase].expected || displayCases[selectedCase].output}
                  </code>
                </div>
              </div>

              {/* Expected Section - Only show when we have results and output differs from expected */}
              {results.length > 0 && displayCases[selectedCase].expected && (
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-3">Expected</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                    <code className="text-white font-mono text-sm whitespace-pre-wrap">
                      {displayCases[selectedCase].expected}
                    </code>
                  </div>
                </div>
              )}

              {/* Show explanation for examples when no results */}
              {results.length === 0 &&
                displayCases[selectedCase].isExample &&
                displayCases[selectedCase].explanation && (
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-3">Explanation</h4>
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <p className="text-blue-300 text-sm">{displayCases[selectedCase].explanation}</p>
                    </div>
                  </div>
                )}

              {/* Show error information if available */}
              {results.length > 0 && displayCases[selectedCase].stderr && (
                <div>
                  <h4 className="text-red-400 text-sm font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Error Output
                  </h4>
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <code className="text-red-300 font-mono text-sm whitespace-pre-wrap">
                      {displayCases[selectedCase].stderr}
                    </code>
                  </div>
                </div>
              )}

              {/* Show compile output if available */}
              {results.length > 0 && displayCases[selectedCase].compile_output && (
                <div>
                  <h4 className="text-yellow-400 text-sm font-medium mb-3">Compile Output</h4>
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <code className="text-yellow-300 font-mono text-sm whitespace-pre-wrap">
                      {displayCases[selectedCase].compile_output}
                    </code>
                  </div>
                </div>
              )}

              {/* Show additional message if available */}
              {results.length > 0 && displayCases[selectedCase].message && (
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-3">Message</h4>
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <p className="text-gray-300 text-sm">{displayCases[selectedCase].message}</p>
                  </div>
                </div>
              )}

              {/* Add some bottom padding for better scrolling */}
              <div className="h-6"></div>
            </>
          )}

          {displayCases.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p>No test cases available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderResultTab = () => (
    <div className="h-full flex flex-col">
      {isRunning ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
            <span className="text-gray-400">Running test cases...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Summary */}
          <div className="flex-shrink-0 p-4 border-b border-gray-700/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {results.every((r) => r.passed) ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="text-white font-medium">
                  {results.filter((r) => r.passed).length}/{results.length} test cases passed
                </span>
              </div>
              {results.length > 0 && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Runtime: {results[0]?.runtime || "0 ms"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>Memory: {results[0]?.memory || "0 MB"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Test Results - Scrollable with visible scrollbar */}
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-4 space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    result.passed
                      ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                      : "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => {
                    setSelectedCase(index)
                    setActiveTab("testcase")
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-white font-medium">
                        {result.isExample ? `Example ${index + 1}` : `Test Case ${index + 1}`}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {result.status || (result.passed ? "PASSED" : "FAILED")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{result.runtime || "0 ms"}</span>
                      <span>{result.memory || "0 MB"}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add some bottom padding for better scrolling */}
              <div className="h-6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <p>Run your code to see results</p>
            <p className="text-sm mt-1">Press Ctrl+Enter to run</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-800/50">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700/30">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-700/50 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              {tab.label}
              {tab.id === "result" && results.length > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    results.every((r) => r.passed) ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {results.filter((r) => r.passed).length}/{results.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm text-gray-400 hover:text-white">
            <Play className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="btn btn-ghost btn-sm text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">{activeTab === "testcase" ? renderTestCaseTab() : renderResultTab()}</div>
    </div>
  )
}

export default TestCasePanel
