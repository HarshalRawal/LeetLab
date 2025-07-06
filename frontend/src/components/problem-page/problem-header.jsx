"use client"

import { Heart, Share, Bookmark, CheckCircle } from "lucide-react"
import { motion } from "motion/react"

const ProblemHeader = ({ problem }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  return (
    <motion.div
      className="p-6 border-b border-gray-700/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(problem.difficulty)}`}
            >
              {problem.difficulty}
            </span>

            {problem.solved && (
              <span className="badge badge-success gap-1 text-sm">
                <CheckCircle className="w-4 h-4" />
                Solved
              </span>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400">
              {problem.acceptance && problem.acceptance !== "N/A" && <span>Acceptance: {problem.acceptance}</span>}
              <span>Submissions: {problem.solvedBy || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400">
            <Heart className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-sm text-gray-400 hover:text-blue-400">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-sm text-gray-400 hover:text-green-400">
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {problem.tags && problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="px-3 py-1 bg-gray-700/30 text-gray-300 text-sm rounded-md hover:bg-gray-600/30 transition-colors cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ProblemHeader
