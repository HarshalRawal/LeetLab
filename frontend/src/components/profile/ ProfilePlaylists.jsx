import { BookOpen, Play, CheckCircle, Clock } from "lucide-react"
import { motion } from "motion/react"

const ProfilePlaylists = ({ playlists }) => {
  const getProgressColor = (completed, total) => {
    const percentage = (completed / total) * 100
    if (percentage >= 80) return "bg-green-400"
    if (percentage >= 50) return "bg-yellow-400"
    return "bg-orange-400"
  }

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-400" />
          My Playlists
        </h2>
        <button className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-orange-500/30 rounded-xl p-4 cursor-pointer group transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                  {playlist.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    <span>{playlist.count} problems</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>{playlist.completed} completed</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white mb-1">
                  {getProgressPercentage(playlist.completed, playlist.count)}%
                </div>
                <div className="text-xs text-gray-400">{playlist.count - playlist.completed} remaining</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
              <motion.div
                className={`h-2 rounded-full ${getProgressColor(playlist.completed, playlist.count)}`}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage(playlist.completed, playlist.count)}%` }}
                transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {playlist.completed === playlist.count ? "Completed" : "In Progress"}
              </span>
              {playlist.completed < playlist.count && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Clock className="w-3 h-3" />
                  <span>Continue</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Playlists Yet</h3>
          <p className="text-gray-400 mb-4">Create your first playlist to organize your learning</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Create Playlist
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePlaylists
