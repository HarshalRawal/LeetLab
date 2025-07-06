"use client"

import { motion } from "motion/react"
import { ThumbsUp, MessageCircle, Eye } from "lucide-react"

const ProblemSolutions = ({ problem }) => {
  // Mock solutions data
  const solutions = [
    {
      id: 1,
      title: "Hash Map Approach - O(n) Time Complexity",
      author: "john_doe",
      language: "JavaScript",
      votes: 234,
      comments: 45,
      views: 1200,
      code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
    },
    {
      id: 2,
      title: "Brute Force Solution - Easy to Understand",
      author: "coding_master",
      language: "Python",
      votes: 156,
      comments: 23,
      views: 890,
      code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    },
  ]

  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Community Solutions</h3>
          <button className="btn btn-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30">
            Add Solution
          </button>
        </div>

        <div className="space-y-4">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Solution Header */}
              <div className="p-4 border-b border-gray-600/30">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{solution.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>by {solution.author}</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {solution.language}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {solution.votes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {solution.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {solution.views}
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Code */}
              <div className="p-4">
                <pre className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{solution.code}</code>
                </pre>
              </div>

              {/* Solution Actions */}
              <div className="px-4 pb-4 flex items-center gap-2">
                <button className="btn btn-sm btn-ghost text-gray-400 hover:text-green-400">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Upvote
                </button>
                <button className="btn btn-sm btn-ghost text-gray-400 hover:text-blue-400">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comment
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add some bottom padding for better scrolling */}
        <div className="h-6"></div>
      </div>
    </div>
  )
}

export default ProblemSolutions
