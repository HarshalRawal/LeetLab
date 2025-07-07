import { Clock, CheckCircle, XCircle, Code, Timer, HardDrive } from "lucide-react"
import { motion } from "motion/react"

const RecentSubmissions = ({ submissions }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "Wrong Answer":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "Wrong Answer":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    }
  }

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "text-yellow-400 bg-yellow-500/10",
      Python: "text-blue-400 bg-blue-500/10",
      Java: "text-orange-400 bg-orange-500/10",
      "C++": "text-purple-400 bg-purple-500/10",
    }
    return colors[language] || "text-gray-400 bg-gray-500/10"
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const submissionDate = new Date(dateString)
    const diffInHours = Math.floor((now - submissionDate) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          Recent Submissions
        </h2>
        <button className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-orange-500/30 rounded-xl p-4 cursor-pointer group transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                  {submission.problemTitle}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(submission.status)}`}
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLanguageColor(submission.language)}`}>
                    <Code className="w-3 h-3 inline mr-1" />
                    {submission.language}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatTimeAgo(submission.submittedAt)}</span>
            </div>

            {/* Performance metrics for accepted solutions */}
            {submission.status === "Accepted" && (
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>{submission.runtime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{submission.memory}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Submissions Yet</h3>
          <p className="text-gray-400">Start solving problems to see your submission history</p>
        </div>
      )}
    </div>
  )
}

export default RecentSubmissions
