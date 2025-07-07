import { Calendar, Flame, Trophy } from "lucide-react"
import { motion } from "motion/react"

const ProfileHeatMap = ({ data, streak }) => {
  const getColorIntensity = (count) => {
    if (count === 0) return "bg-gray-800/50"
    if (count === 1) return "bg-green-900/50"
    if (count === 2) return "bg-green-700/70"
    if (count === 3) return "bg-green-500/80"
    return "bg-green-400"
  }

  const getTooltipText = (date, count) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    return `${count} problems solved on ${formattedDate}`
  }

  // Group data by weeks
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const currentMonth = new Date().getMonth()
  const monthLabels = []
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12
    monthLabels.push(months[monthIndex])
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Activity Heat Map
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{streak.current} day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Best: {streak.longest} days</span>
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex justify-between mb-2 text-xs text-gray-500">
        {monthLabels.map((month, index) => (
          <span key={index}>{month}</span>
        ))}
      </div>

      {/* Heat map grid */}
      <div className="mb-4">
        <div className="grid grid-cols-53 gap-1">
          {data.map((day, index) => (
            <motion.div
              key={day.date}
              className={`w-3 h-3 rounded-sm ${getColorIntensity(day.count)} hover:ring-2 hover:ring-orange-400/50 cursor-pointer transition-all duration-200`}
              title={getTooltipText(day.date, day.count)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.001, duration: 0.2 }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-800/50"></div>
            <div className="w-3 h-3 rounded-sm bg-green-900/50"></div>
            <div className="w-3 h-3 rounded-sm bg-green-700/70"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500/80"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400"></div>
          </div>
          <span>More</span>
        </div>
        <div className="text-xs text-gray-500">
          {data.filter((d) => d.count > 0).length} active days in the last year
        </div>
      </div>
    </div>
  )
}

export default ProfileHeatMap
