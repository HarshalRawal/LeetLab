import { Trophy, Target, TrendingUp, Flame, Award } from "lucide-react"
import { motion } from "motion/react"

const ProfileStats = ({ stats, streak }) => {
  const difficultyColors = {
    easy: "text-green-400 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    hard: "text-red-400 bg-red-500/10 border-red-500/20",
  }

  const calculateAcceptanceRate = () => {
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.solved / stats.total) * 100)
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          Progress Overview
        </h2>
      </div>

      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-gray-700/30 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-white mb-1">{stats?.solved || 0}</div>
            <div className="text-gray-400 text-sm">Problems Solved</div>
          </motion.div>
          <motion.div
            className="bg-gray-700/30 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-2xl font-bold text-orange-400 mb-1">{calculateAcceptanceRate()}%</div>
            <div className="text-gray-400 text-sm">Acceptance Rate</div>
          </motion.div>
        </div>

        {/* Difficulty Breakdown */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            Difficulty Breakdown
          </h3>
          <div className="space-y-3">
            {["easy", "medium", "hard"].map((difficulty) => (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${difficultyColors[difficulty]}`}
                  >
                    {difficulty}
                  </span>
                  <span className="text-white font-medium">{stats?.[difficulty] || 0}</span>
                </div>
                <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${difficulty === "easy" ? "bg-green-400" : difficulty === "medium" ? "bg-yellow-400" : "bg-red-400"}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${stats?.[difficulty] ? (stats[difficulty] / Math.max(stats.easy, stats.medium, stats.hard, 1)) * 100 : 0}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Info */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Streak Information
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
              <span className="text-gray-400">Current Streak</span>
              <span className="text-orange-400 font-bold">{streak?.current || 0} days</span>
            </div>
            <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
              <span className="text-gray-400">Longest Streak</span>
              <span className="text-yellow-400 font-bold">{streak?.longest || 0} days</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-white font-medium">Problem Solver</div>
                <div className="text-gray-400 text-sm">Solved 10+ problems</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-white font-medium">Streak Master</div>
                <div className="text-gray-400 text-sm">7-day solving streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileStats
