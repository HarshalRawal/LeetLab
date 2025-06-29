"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { CheckCircle, Circle, TrendingUp, Filter, Search } from "lucide-react"
import { Link } from "react-router-dom"

const ProblemTable = ({ problems }) => {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProblems = problems.filter((problem) => {
    const matchesFilter = filter === "all" || problem.difficulty.toLowerCase() === filter
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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
      className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-700/30">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white">Problems</h3>
            <span className="text-sm text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
              {filteredProblems.length} problems
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700/30 border border-gray-600/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700/30 border border-gray-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/20">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300">Title</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300">Difficulty</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300">Acceptance</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-300">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem, index) => (
              <motion.tr
                key={problem._id}
                className="border-b border-gray-700/20 hover:bg-gray-700/10 transition-colors group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <td className="p-4">
                  {problem.solved ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500" />
                  )}
                </td>
                <td className="p-4">
                  <Link
                    to={`/problems/${problem._id}`}
                    className="text-white hover:text-orange-400 font-medium transition-colors group-hover:text-orange-300"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">
                      {problem.acceptanceRate || Math.floor(Math.random() * 40 + 30)}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < (problem.frequency || Math.floor(Math.random() * 5 + 1)) ? "bg-orange-400" : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No problems match your current filters</p>
        </div>
      )}
    </motion.div>
  )
}

export default ProblemTable
