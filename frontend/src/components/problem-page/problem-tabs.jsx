"use client"

import { FileText, Lightbulb, History } from "lucide-react"
import { motion } from "motion/react"

const ProblemTabs = ({ activeTab, onTabChange, problem }) => {
  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "solutions", label: "Solutions", icon: Lightbulb },
    {
      id: "submissions",
      label: "Submissions",
      icon: History,
      badge: problem?.hasPreviousSubmission ? "•" : null,
    },
  ]

  return (
    <div className="border-b border-gray-700/30">
      <div className="flex">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? "text-orange-400 border-b-2 border-orange-400" : "text-gray-400 hover:text-white"
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && <span className="w-2 h-2 bg-green-400 rounded-full" title="Has previous submissions" />}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ProblemTabs
