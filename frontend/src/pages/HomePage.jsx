"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "../Store/useAuthStore"
import { Loader, Code, Trophy, Target, TrendingUp, Users, Star, ArrowRight, Play, BookOpen, Zap } from "lucide-react"
import ProblemTable from "../components/Problem/ProblemTable"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
const HomePage = () => {
  const { authUser } = useAuthStore()

  // Mock problems data
  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", solved: true },
    { id: 2, title: "Reverse Linked List", difficulty: "Medium", solved: false },
    { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", solved: false },
    { id: 4, title: "Valid Parentheses", difficulty: "Easy", solved: true },
    { id: 5, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", solved: false },
  ]

  const stats = {
    totalProblems: problems.length,
    solvedProblems: problems.filter((p) => p.solved).length,
    easyProblems: problems.filter((p) => p.difficulty === "Easy").length,
    mediumProblems: problems.filter((p) => p.difficulty === "Medium").length,
    hardProblems: problems.filter((p) => p.difficulty === "Hard").length,
  }

  const quickStats = [
    {
      icon: Code,
      label: "Total Problems",
      value: stats.totalProblems,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      icon: Trophy,
      label: "Solved",
      value: stats.solvedProblems,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: Target,
      label: "Easy",
      value: stats.easyProblems,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: TrendingUp,
      label: "Medium",
      value: stats.mediumProblems,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Zap,
      label: "Hard",
      value: stats.hardProblems,
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
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero Section */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Welcome back, {authUser?.name}!</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Master </span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">Coding</span>
            <br />
            <span className="text-white">Challenges</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Sharpen your programming skills with our comprehensive collection of coding problems. From algorithms to data structures, prepare for technical interviews and become a better developer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
  to="/problems"
  className="group relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 overflow-hidden"
>
  {/* Rotating Shine */}
  <span className="absolute inset-0 rounded-xl border-2 border-transparent animate-shine pointer-events-none" />

  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  Start Solving
</Link>
            <Link to="/leaderboard" className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50 hover:border-orange-500/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
          {quickStats.map((stat, index) => (
            <motion.div key={stat.label} className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300`} whileHover={{ y: -5 }}>
              <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div className="grid md:grid-cols-3 gap-8 mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
          {features.map((feature, index) => (
            <motion.div key={feature.title} className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 group hover:border-orange-500/30 transition-all duration-300" whileHover={{ y: -5 }}>
              <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problems Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recent Problems</h2>
              <p className="text-gray-400">Start solving problems to improve your skills</p>
            </div>
            <Link to="/problems" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold group transition-colors">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ProblemTable problems={problems} />
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
