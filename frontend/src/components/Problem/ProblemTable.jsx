"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, Filter, Search, Loader2, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom" // Make sure this import is correct
import { useProblemStore } from "../../Store/useProblemStore"
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll"

const ProblemsTable = ({ isHomePage = false }) => {
  const {
    problems,
    solvedProblems,
    isProblemsLoading,
    isLoadingMore,
    hasMore,
    filters,
    setFilter,
    getAllProblems,
    loadMoreProblems,
    resetAndFetch,
    getSolvedProblemByUser,
    getFilteredProblems,
    getProblemsStats,
  } = useProblemStore()

  const [searchDebounce, setSearchDebounce] = useState("")

  // Get filtered problems and limit to 5 for homepage
  const filteredProblems = getFilteredProblems()
  const displayProblems = isHomePage ? filteredProblems.slice(0, 5) : filteredProblems
  const stats = getProblemsStats()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDebounce !== filters.searchTerm) {
        setFilter("searchTerm", searchDebounce)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchDebounce, filters.searchTerm, setFilter])

  // Initial load
  useEffect(() => {
    if (problems.length === 0) {
      getAllProblems(20, null, true)
      getSolvedProblemByUser()
    }
  }, [])

  // Infinite scroll callback
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMoreProblems()
    }
  }, [isLoadingMore, hasMore, loadMoreProblems])

  // Infinite scroll hook
  const lastElementRef = useInfiniteScroll(handleLoadMore, hasMore, isLoadingMore)

  const handleFilterChange = (key, value) => {
    setFilter(key, value)
  }

  const handleSearch = (searchTerm) => {
    setSearchDebounce(searchTerm)
  }

  const handleRefresh = () => {
    resetAndFetch()
    getSolvedProblemByUser()
  }

  const isProblemSolved = (problemId) => {
    return solvedProblems.some((sp) => sp.id === problemId)
  }

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
      className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with filters and stats */}
      <div className="p-6 border-b border-gray-700/30 sticky top-0 bg-gray-800/95 backdrop-blur-xl z-10">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white">All Problems</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
                {filteredProblems.length} problems
                {hasMore && <span className="text-orange-400 ml-1">+</span>}
              </span>
              <span className="text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                {stats.solved} solved ({stats.solvedPercentage}%)
              </span>
            </div>
          </div>

          {!isHomePage && (
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isProblemsLoading}
                className="btn btn-ghost btn-sm text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isProblemsLoading ? "animate-spin" : ""}`} />
              </button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchDebounce}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-gray-700/30 border border-gray-600/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors w-64"
                />
                {searchDebounce !== filters.searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Difficulty Filter */}
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                className="bg-gray-700/30 border border-gray-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isProblemsLoading && problems.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <span className="ml-3 text-gray-400">Loading problems...</span>
          </div>
        ) : (
          <>
            <table className="w-full table-fixed">
              <thead className="bg-gray-700/20">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300 w-16">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300 w-2/5">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300 w-24">Difficulty</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300 w-1/4">Tags</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300 w-24">Solve</th>
                </tr>
              </thead>
              <tbody>
                {displayProblems.map((problem, index) => {
                  const isLast = index === displayProblems.length - 1
                  const isSolved = isProblemSolved(problem.id)

                  return (
                    <motion.tr
                      key={problem.id}
                      ref={isLast ? lastElementRef : null}
                      className="border-b border-gray-700/20 hover:bg-gray-700/10 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.3 }}
                    >
                      <td className="p-4 w-16">
                        <div className="flex justify-center">
                          {isSolved ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 w-2/5">
                        {/* Make the title clickable */}
                        <Link
                          to={`/problems/${problem.id}`}
                          className="text-white font-medium truncate cursor-pointer hover:text-orange-400 transition-colors block"
                          title={problem.title}
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="p-4 w-24">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border inline-block ${getDifficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="p-4 w-1/4">
                        <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
                          {problem.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-700/30 text-gray-300 text-xs rounded-md truncate max-w-20"
                              title={tag}
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags?.length > 2 && (
                            <span
                              className="px-2 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-md"
                              title={`${problem.tags.length - 2} more tags`}
                            >
                              +{problem.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 w-24">
                        <Link
                          to={`/problems/${problem.id}`}
                          className={`btn btn-sm transition-all duration-300 ${
                            isSolved
                              ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                              : "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                          }`}
                        >
                          {isSolved ? "Solved" : "Solve"}
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>

            {/* Loading more indicator - only show on full problems page */}
            {!isHomePage && isLoadingMore && (
              <div className="flex items-center justify-center py-8 border-t border-gray-700/20">
                <motion.div
                  className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <span className="text-gray-400">Loading more problems...</span>
              </div>
            )}

            {/* End of results indicator - only show on full problems page */}
            {!isHomePage && !hasMore && problems.length > 0 && (
              <div className="text-center py-8 border-t border-gray-700/20">
                <div className="inline-flex items-center gap-2 text-gray-400 bg-gray-700/20 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>You've reached the end! {problems.length} problems loaded</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {filteredProblems.length === 0 && !isProblemsLoading && problems.length > 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No problems match your current filters</p>
          <button
            onClick={() => {
              setFilter("difficulty", "all")
              setFilter("searchTerm", "")
              setSearchDebounce("")
            }}
            className="mt-4 btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
          >
            Clear Filters
          </button>
        </div>
      )}

      {problems.length === 0 && !isProblemsLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No problems found</div>
          <button
            onClick={handleRefresh}
            className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default ProblemsTable
