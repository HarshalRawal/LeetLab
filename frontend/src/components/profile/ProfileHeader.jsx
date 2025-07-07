import { Calendar, User, Hash, Trophy, Flame } from "lucide-react"
import { motion } from "motion/react"

const ProfileHeader = ({ profileData }) => {
  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(profileData.firstName, profileData.lastName)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">{profileData.userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {formatJoinDate(profileData.joinedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">{profileData.streak.current} day streak</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">Longest: {profileData.streak.longest} days</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">{profileData.streak.totalDays} active days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
