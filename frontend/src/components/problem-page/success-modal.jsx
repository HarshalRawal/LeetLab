"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Trophy, Star, ArrowRight, X } from "lucide-react"
import confetti from "canvas-confetti"
import { Link } from "react-router-dom"

const SuccessModal = ({ isOpen, onClose, problem }) => {
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti effect
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

      // Show stats after a delay
      setTimeout(() => setShowStats(true), 1000)
    }
  }, [isOpen])

  const mockStats = {
    runtime: "68 ms",
    memory: "42.1 MB",
    percentile: "85.4%",
    attempts: 3,
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
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700/50 relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <motion.div
              className="text-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Accepted!</h2>
              <p className="text-gray-400">Congratulations! Your solution has been accepted.</p>
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

            {/* Stats */}
            <AnimatePresence>
              {showStats && (
                <motion.div
                  className="grid grid-cols-2 gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-400">{mockStats.runtime}</div>
                    <div className="text-xs text-gray-400">Runtime</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">{mockStats.memory}</div>
                    <div className="text-xs text-gray-400">Memory</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-400">{mockStats.percentile}</div>
                    <div className="text-xs text-gray-400">Beats</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-400">{mockStats.attempts}</div>
                    <div className="text-xs text-gray-400">Attempts</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

export default SuccessModal
