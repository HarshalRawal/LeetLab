"use client"

import { useState } from "react"
import { X, Plus, Hash, FileText, BarChart3 } from 'lucide-react'
import { motion } from "motion/react"

export function BasicInfoStep({ form }) {
  const [tagInput, setTagInput] = useState("")
  const tags = form.watch("tags") || []

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue("tags", [...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <label className="text-sm font-medium text-white">Problem Title</label>
          </div>
          <input
            {...form.register("title")}
            placeholder="e.g., Add Two Numbers"
            className="input input-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
          />
          {form.formState.errors.title && (
            <motion.p className="text-red-400 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {form.formState.errors.title.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <label className="text-sm font-medium text-white">Description</label>
          </div>
          <textarea
            {...form.register("description")}
            placeholder="Describe the problem in detail..."
            rows={4}
            className="textarea textarea-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 resize-none"
          />
          {form.formState.errors.description && (
            <motion.p className="text-red-400 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {form.formState.errors.description.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <label className="text-sm font-medium text-white">Difficulty</label>
          </div>
          <select
            {...form.register("difficulty")}
            className="select select-bordered w-full bg-gray-800/50 border-gray-700/50 text-white focus:border-orange-500/50 focus:outline-none"
          >
            <option value="EASY" className="bg-gray-800">
              🟢 Easy
            </option>
            <option value="MEDIUM" className="bg-gray-800">
              🟡 Medium
            </option>
            <option value="HARD" className="bg-gray-800">
              🔴 Hard
            </option>
          </select>
          {form.formState.errors.difficulty && (
            <motion.p className="text-red-400 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {form.formState.errors.difficulty.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-orange-400" />
            <label className="text-sm font-medium text-white">Tags</label>
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="input input-bordered flex-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="badge bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/50 transition-all duration-300 gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-400 transition-colors"
                    onClick={() => removeTag(tag)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          {form.formState.errors.tags && (
            <motion.p className="text-red-400 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {form.formState.errors.tags.message}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
