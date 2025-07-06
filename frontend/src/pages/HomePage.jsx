import { useEffect } from "react"
import { useAuthStore } from "../Store/useAuthStore"
import { useProblemStore } from "../Store/useProblemStore"
import { Code, Trophy, Target, TrendingUp, Users, Star, ArrowRight, Play, BookOpen, Zap, Loader2 } from "lucide-react"
import { Link } from "react-router-dom" // Make sure this import is correct
import { motion } from "framer-motion"
import ProblemsTable from "../components/Problem/ProblemTable"

const HomePage = () => {
  const { authUser } = useAuthStore()
  const { problems, solvedProblems, isProblemsLoading, getAllProblems, getSolvedProblemByUser, getProblemsStats } =
    useProblemStore()

  // Load initial data - only 5 problems for homepage
  useEffect(() => {
    if (problems.length === 0) {
      getAllProblems(5, null, true) // Only load 5 problems for homepage
    }
    // Load solved problems
    getSolvedProblemByUser()
  }, [])

  // Get real stats from store
  const stats = getProblemsStats()

  // Calculate difficulty breakdown from current problems
  const difficultyStats = {
    easyProblems: problems.filter((p) => p.difficulty?.toLowerCase() === "easy").length,
    mediumProblems: problems.filter((p) => p.difficulty?.toLowerCase() === "medium").length,
    hardProblems: problems.filter((p) => p.difficulty?.toLowerCase() === "hard").length,
  }

  const quickStats = [
    {
      icon: Code,
      label: "Total Problems",
      value: stats.total,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      icon: Trophy,
      label: "Solved",
      value: stats.solved,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: Target,
      label: "Easy",
      value: difficultyStats.easyProblems,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: TrendingUp,
      label: "Medium",
      value: difficultyStats.mediumProblems,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Zap,
      label: "Hard",
      value: difficultyStats.hardProblems,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Learn & Practice",
      description: "Master algorithms and data structures with our curated problem sets",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join thousands of developers improving their coding skills together",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Trophy,
      title: "Compete",
      description: "Participate in contests and climb the leaderboard rankings",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 4 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Welcome back, {authUser?.name || "Developer"}!</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Master </span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Coding
            </span>
            <br />
            <span className="text-white">Challenges</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Sharpen your programming skills with our comprehensive collection of coding problems. From algorithms to
            data structures, prepare for technical interviews and become a better developer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/problems"
              className="group relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 overflow-hidden"
            >
              <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Start Solving
            </Link>
            <Link
              to="/add-problem"
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-orange-500/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              <Code className="w-5 h-5" />
              Create Problem
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300`}
              whileHover={{ y: -5 }}
            >
              <div
                className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {isProblemsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                  <p className="text-gray-400 text-sm">
                    {stats.solved} of {stats.total} problems solved
                  </p>
                </div>
                <div className="text-2xl font-bold text-orange-400">{stats.solvedPercentage}%</div>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.solvedPercentage}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 group hover:border-orange-500/30 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div
                className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Problems Section - Only 5 Problems */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Problems</h2>
              <p className="text-gray-400">Get started with these popular coding challenges</p>
            </div>
            <Link
              to="/problems"
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold group transition-colors"
            >
              View All Problems
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Show loading state or problems table */}
          {isProblemsLoading && problems.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-12">
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <span className="text-gray-400">Loading featured problems...</span>
              </div>
            </div>
          ) : problems.length > 0 ? (
            <ProblemsTable isHomePage={true} />
          ) : (
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-12 text-center">
              <Code className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Problems Yet</h3>
              <p className="text-gray-400 mb-6">Start by creating your first coding problem</p>
              <Link
                to="/add-problem"
                className="inline-flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Create Problem
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
