"use client"

import { Play, Send, Settings, Loader2, RotateCcw, Upload } from "lucide-react"
import { motion } from "motion/react"

const EditorControls = ({ language, onLanguageChange, onRun, onSubmit, isRunning, isSubmitting, theme = "dark" }) => {
  const languages = [
    { id: "javascript", name: "JavaScript", icon: "JS" },
    { id: "python", name: "Python", icon: "PY" },
    { id: "java", name: "Java", icon: "JAVA" },
  ]

  const getControlsBackground = () => {
    switch (theme) {
      case "light":
        return "bg-gray-100/80 border-gray-300/50"
      case "high-contrast":
        return "bg-black border-white/20"
      case "monokai":
        return "bg-[#272822]/80 border-gray-600/30"
      default:
        return "bg-gray-800/50 border-gray-700/30"
    }
  }

  const getTextColor = () => {
    switch (theme) {
      case "light":
        return "text-gray-800"
      case "high-contrast":
        return "text-white"
      default:
        return "text-white"
    }
  }

  const getButtonStyles = () => {
    switch (theme) {
      case "light":
        return "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 border-gray-300/50"
      case "high-contrast":
        return "bg-white/10 hover:bg-white/20 text-white border-white/30"
      case "monokai":
        return "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border-gray-600/50"
      default:
        return "bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-600/50"
    }
  }

  return (
    <div className={`${getControlsBackground()} border-b p-4 backdrop-blur-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={`appearance-none ${getButtonStyles()} px-4 py-2 pr-8 rounded-lg text-sm focus:border-orange-500/50 focus:outline-none cursor-pointer border`}
            >
              {languages.map((lang) => (
                <option
                  key={lang.id}
                  value={lang.id}
                  className={theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"}
                >
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-4 h-4 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Auto-complete toggle */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="autocomplete" className="checkbox checkbox-sm checkbox-warning" defaultChecked />
            <label
              htmlFor="autocomplete"
              className={`text-sm cursor-pointer ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
            >
              Auto-complete
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Settings */}
          <button
            className={`btn btn-ghost btn-sm ${theme === "light" ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-white"}`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            className={`btn btn-ghost btn-sm ${theme === "light" ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-white"}`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Upload */}
          <button
            className={`btn btn-ghost btn-sm ${theme === "light" ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-white"}`}
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Run Button */}
          <motion.button
            onClick={onRun}
            disabled={isRunning}
            className={`btn btn-sm ${getButtonStyles()} disabled:opacity-50 min-w-[80px] border`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                Running
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Run
              </>
            )}
          </motion.button>

          {/* Submit Button */}
          <motion.button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn btn-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none disabled:opacity-50 min-w-[90px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                Submitting
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-1" />
                Submit
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default EditorControls
