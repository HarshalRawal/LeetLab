"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Trophy, Star, ArrowRight, X, CheckCircle, XCircle, AlertTriangle, Clock, Database } from 'lucide-react'
import confetti from "canvas-confetti"
import { Link } from "react-router-dom"

const SubmissionResultsModal = ({ isOpen, onClose, problem, submissionResult }) => {
  const [showStats, setShowStats] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    if (isOpen && submissionResult?.summary?.allPassed) {
      // Trigger confetti effect only for fully accepted solutions
      const duration = 3000
      const end = Date.now() + duration

      const colors = ["#ff6b35", "#f7931e", "#ffd700", "#32cd32", "#00bfff"]

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }

    // Show stats after a delay
    if (isOpen) {
      setTimeout(() => setShowStats(true), 1000)
    }
  }, [isOpen, submissionResult?.summary?.allPassed])

  if (!submissionResult) return null

  const { summary, results } = submissionResult
  const { allPassed, examplesPassed, testcasesPassed } = summary

  const getStatusInfo = () => {
    if (allPassed) {
      return {
        title: "Accepted!",
        subtitle: "Congratulations! Your solution has been accepted.",
        icon: Trophy,
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
      }
    } else if (examplesPassed && !testcasesPassed) {
      return {
        title: "Partially Correct",
        subtitle: "Examples passed but some test cases failed.",
        icon: AlertTriangle,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
      }
    } else {
      return {
        title: "Wrong Answer",
        subtitle: "Some examples or test cases failed.",
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/30",
      }
    }
  }

  const statusInfo = getStatusInfo()

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "examples", label: `Examples (${summary.passedExamples}/${summary.totalExamples})` },
    { id: "testcases", label: `Test Cases (${summary.passedTestcases}/${summary.totalTestcases})` },
  ]

  const renderSummaryTab = () => (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
        <div className="flex items-center gap-3">
          <statusInfo.icon className={`w-6 h-6 ${statusInfo.color}`} />
          <div>
            <h3 className={`font-semibold ${statusInfo.color}`}>{statusInfo.title}</h3>
            <p className="text-gray-400 text-sm">{statusInfo.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-3 rounded-lg border ${examplesPassed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
        >
          <div className="flex items-center gap-2 mb-1">
            {examplesPassed ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-medium text-white">Examples</span>
          </div>
          <div className={`text-lg font-bold ${examplesPassed ? "text-green-400" : "text-red-400"}`}>
            {summary.passedExamples}/{summary.totalExamples}
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border ${testcasesPassed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
        >
          <div className="flex items-center gap-2 mb-1">
            {testcasesPassed ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-medium text-white">Test Cases</span>
          </div>
          <div className={`text-lg font-bold ${testcasesPassed ? "text-green-400" : "text-red-400"}`}>
            {summary.passedTestcases}/{summary.totalTestcases}
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      {showStats && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-400">{results[0]?.runtime || "0 ms"}</div>
            <div className="text-xs text-gray-400">Runtime</div>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-400">{results[0]?.memory || "0 MB"}</div>
            <div className="text-xs text-gray-400">Memory</div>
          </div>
        </motion.div>
      )}
    </div>
  )

  const renderResultsTab = (type) => {
    const filteredResults = results.filter((r) => r.type === type)

    if (filteredResults.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-400">No {type} results available</div>
        </div>
      )
    }

    return (
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            className={`p-3 rounded-lg border ${
              result.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
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
                  <span className="text-sm font-medium text-white">
                    {result.isExample ? `Example ${result.testCaseNumber}` : `Test Case ${result.testCaseNumber}`}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {result.status}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400 ml-auto">
                    <Clock className="w-3 h-3" />
                    {result.runtime}
                    <Database className="w-3 h-3" />
                    {result.memory}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <code className="text-gray-300 bg-gray-800/50 px-1 rounded text-xs">{result.input}</code>
                  </div>
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <code
                      className={`px-1 rounded text-xs ${result.passed ? "text-green-300 bg-green-800/20" : "text-red-300 bg-red-800/20"}`}
                    >
                      {result.output || "No output"}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected: </span>
                    <code className="text-gray-300 bg-gray-800/50 px-1 rounded text-xs">{result.expected}</code>
                  </div>

                  {/* Show error information if available */}
                  {result.stderr && (
                    <div>
                      <span className="text-red-400">Error: </span>
                      <code className="text-red-300 bg-red-800/20 px-1 rounded text-xs">{result.stderr}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] border border-gray-700/50 relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <motion.div
              className="text-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
            >
              <div
                className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 border ${statusInfo.borderColor}`}
              >
                <statusInfo.icon className={`w-8 h-8 ${statusInfo.color}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>{statusInfo.title}</h2>
              <p className="text-gray-400">{statusInfo.subtitle}</p>
            </motion.div>

            {/* Problem Info */}
            <motion.div
              className="bg-gray-700/30 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="font-semibold text-white mb-1">{problem.title}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    problem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400"
                      : problem.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="border-b border-gray-700/30 mb-4">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-orange-400 border-b-2 border-orange-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6 min-h-[200px]">
              {activeTab === "summary" && renderSummaryTab()}
              {activeTab === "examples" && renderResultsTab("example")}
              {activeTab === "testcases" && renderResultsTab("testcase")}
            </div>

            {/* Actions */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={onClose}
                className="flex-1 btn bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-600/50"
              >
                Continue
              </button>
              <Link
                to="/problems"
                className="flex-1 btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none flex items-center justify-center"
              >
                Next Problem
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SubmissionResultsModal
