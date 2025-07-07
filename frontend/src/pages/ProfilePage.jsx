"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Filter, ChevronDown, ChevronUp, Code2, Play, FileText } from 'lucide-react'
import { useAuthStore } from "../Store/useAuthStore"
import { useProblemStore } from "../Store/useProblemStore"
import { motion } from "motion/react"
import ProfileStats from "../components/profile/ProfileStats"
import ProfileHeatMap from "../components/profile/ProfileHeatMap"
import ProfilePlaylists from "../components/profile/ ProfilePlaylists"

const ProfilePage = () => {
  const { authUser } = useAuthStore()
  const { problems, solvedProblems, getSolvedProblemByUser, getProblemsStats } = useProblemStore()
  const [activeTab, setActiveTab] = useState("Profile")
  const [expandedSubmission, setExpandedSubmission] = useState(null)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Load solved problems if not already loaded
        if (solvedProblems.length === 0) {
          await getSolvedProblemByUser()
        }

        // Mock profile data - replace with actual API call
        const mockProfileData = {
          firstName: authUser?.name?.split(" ")[0] || "John",
          lastName: authUser?.name?.split(" ")[1] || "Doe",
          userId: authUser?.id || "user123",
          joinedAt: authUser?.createdAt || "2024-01-15T10:30:00Z",
          totalSubmissions: 2,
          acceptedSubmissions: 2,
          streak: {
            current: 7,
            longest: 15,
            totalDays: 45,
          },
          heatMapData: generateMockHeatMapData(),
          submissions: [
            {
              id: 1,
              problemTitle: "Valid Palindrome",
              status: "Accepted",
              language: "JavaScript",
              submittedAt: "2025-07-04T19:43:00Z",
              code: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
};`,
              input: "A man, a plan, a canal: Panama\nrace a car",
              output: "true\nfalse",
            },
          ],
          playlists: [
            { id: 1, name: "Array Problems", count: 12, completed: 8 },
            { id: 2, name: "Dynamic Programming", count: 20, completed: 5 },
            { id: 3, name: "Graph Algorithms", count: 15, completed: 3 },
          ],
        }

        setProfileData(mockProfileData)
      } catch (error) {
        console.error("Error loading profile data:", error)
      }
    }

    if (authUser) {
      loadProfileData()
    }
  }, [authUser, getSolvedProblemByUser, solvedProblems.length])

  // Generate mock heat map data for the last 365 days
  const generateMockHeatMapData = () => {
    const data = []
    const today = new Date()

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Random activity level (0-4)
      const activity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0

      data.push({
        date: date.toISOString().split("T")[0],
        count: activity,
      })
    }

    return data
  }

  const tabs = ["Profile", "Problems Solved", "Playlists", "Submissions"]
  const stats = getProblemsStats()

  const formatSubmissionTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const toggleSubmissionExpansion = (submissionId) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId)
  }

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm">First Name</label>
            <p className="text-white font-medium">{profileData?.firstName}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Last Name</label>
            <p className="text-white font-medium">{profileData?.lastName}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">User ID</label>
            <p className="text-white font-medium">{profileData?.userId}</p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Joined</label>
            <p className="text-white font-medium">
              {new Date(profileData?.joinedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Heat Map */}
      <ProfileHeatMap data={profileData?.heatMapData || []} streak={profileData?.streak || {}} />

      {/* Stats */}
      <ProfileStats stats={stats} streak={profileData?.streak || {}} />
    </div>
  )

  const renderProblemsSolvedTab = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <ProfileStats stats={stats} streak={profileData?.streak || {}} />

      {/* Difficulty Distribution Chart */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Difficulty Distribution</h2>
        <div className="space-y-6">
          {/* Pie Chart Representation */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgb(55, 65, 81)"
                  strokeWidth="8"
                />
                
                {/* Easy problems arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.easy / Math.max(stats.total, 1)) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Medium problems arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgb(234, 179, 8)"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.medium / Math.max(stats.total, 1)) * 251.2} 251.2`}
                  strokeDashoffset={`-${(stats.easy / Math.max(stats.total, 1)) * 251.2}`}
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Hard problems arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.hard / Math.max(stats.total, 1)) * 251.2} 251.2`}
                  strokeDashoffset={`-${((stats.easy + stats.medium) / Math.max(stats.total, 1)) * 251.2}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.solved}</div>
                  <div className="text-gray-400 text-sm">Solved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-green-400 font-bold text-lg">{stats.easy || 0}</div>
                <div className="text-gray-400 text-sm">Easy</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div>
                <div className="text-yellow-400 font-bold text-lg">{stats.medium || 0}</div>
                <div className="text-gray-400 text-sm">Medium</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <div>
                <div className="text-red-400 font-bold text-lg">{stats.hard || 0}</div>
                <div className="text-gray-400 text-sm">Hard</div>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-medium">Easy Problems</span>
                <span className="text-gray-400">{stats.easy || 0} solved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-green-400 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total > 0 ? (stats.easy / stats.total) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 font-medium">Medium Problems</span>
                <span className="text-gray-400">{stats.medium || 0} solved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-yellow-400 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-medium">Hard Problems</span>
                <span className="text-gray-400">{stats.hard || 0} solved</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-red-400 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total > 0 ? (stats.hard / stats.total) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlaylistsTab = () => (
    <ProfilePlaylists playlists={profileData?.playlists || []} />
  )

  const renderSubmissionsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Submissions</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 transition-colors">
            <Filter className="w-4 h-4" />
            All Submissions
          </button>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profileData?.totalSubmissions}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{profileData?.acceptedSubmissions}</div>
              <div className="text-gray-400 text-sm">Accepted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {profileData?.submissions?.map((submission) => (
          <motion.div
            key={submission.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Submission Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => toggleSubmissionExpansion(submission.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                    {submission.status}
                  </span>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Code2 className="w-4 h-4" />
                    <span className="font-medium">{submission.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>Submitted {formatSubmissionTime(submission.submittedAt)}</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedSubmission === submission.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedSubmission === submission.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-700"
              >
                {/* Solution Code */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-white" />
                    <h3 className="text-white font-medium">Solution Code</h3>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300 whitespace-pre-wrap">
                      <code>{submission.code}</code>
                    </pre>
                  </div>
                </div>

                {/* Input/Output */}
                <div className="grid grid-cols-2 gap-4 p-4 pt-0">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-white" />
                      <h4 className="text-white font-medium">Input</h4>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-sm">
                      <pre className="text-gray-300 whitespace-pre-wrap">{submission.input}</pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-white" />
                      <h4 className="text-white font-medium">Output</h4>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 font-mono text-sm">
                      <pre className="text-gray-300 whitespace-pre-wrap">{submission.output}</pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return renderProfileTab()
      case "Problems Solved":
        return renderProblemsSolvedTab()
      case "Playlists":
        return renderPlaylistsTab()
      case "Submissions":
        return renderSubmissionsTab()
      default:
        return renderProfileTab()
    }
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-xl p-1 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gray-700 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
