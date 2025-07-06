"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProblemHeader from "./problem-header"
import ProblemTabs from "./problem-tabs"
import ProblemDescription from "./problem-description"
import ProblemSolutions from "./problem-solutions"
import ProblemSubmissions from "./problem-submissions"

const ProblemDetails = ({ problem }) => {
  const [activeTab, setActiveTab] = useState("description")

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <ProblemDescription problem={problem} />
      case "solutions":
        return <ProblemSolutions problem={problem} />
      case "submissions":
        return <ProblemSubmissions problem={problem} />
      default:
        return <ProblemDescription problem={problem} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-800/30">
      {/* Problem Header - Fixed */}
      <div className="flex-shrink-0">
        <ProblemHeader problem={problem} />
      </div>

      {/* Tabs - Fixed */}
      <div className="flex-shrink-0">
        <ProblemTabs activeTab={activeTab} onTabChange={setActiveTab} problem={problem} />
      </div>

      {/* Tab Content - Scrollable with visible scrollbar */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetails
