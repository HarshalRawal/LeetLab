"use client"

import React from "react"
import { toast } from "react-toastify"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "motion/react"
import { Home, List, ArrowLeft, Sun, Moon, Monitor, Palette, RotateCcw } from "lucide-react"
import { Link } from "react-router-dom"
import ProblemDetails from "./problem-details"
import CodeEditor from "./code-editor"
import SubmissionResultsModal from "./submission-results-modal"
import EditorShortcuts from "./editor-shortcuts"
import { useCodeExecutionStore, getLanguageId } from "../../Store/useCodeExecutionStore"

const ProblemPage = ({ problem }) => {
  const [showSuccess, setShowSuccess] = useState(false)
  // Initialize with the correct code snippet immediately
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [leftWidth, setLeftWidth] = useState(50) // Percentage
  const [isResizing, setIsResizing] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("editor-theme") || "dark"
    }
    return "dark"
  })
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  // Use code execution store
  const { isRunning, isSubmitting, runResults, submitResults, error, runCode, submitCode, clearResults, clearError } =
    useCodeExecutionStore()

  const containerRef = useRef(null)

  // Theme options
  const themes = [
    { id: "dark", name: "Dark", icon: Moon, description: "Default dark theme" },
    { id: "light", name: "Light", icon: Sun, description: "Clean light theme" },
    { id: "high-contrast", name: "High Contrast", icon: Monitor, description: "High contrast for accessibility" },
    { id: "monokai", name: "Monokai", icon: Palette, description: "Popular Monokai theme" },
  ]

  // Update code when problem changes (ensure immediate loading)
  useEffect(() => {
    if (problem?.codeSnippets?.[language]) {
      console.log("Setting code for language:", language, problem.codeSnippets[language])
      setCode(problem.codeSnippets[language])
    } else if (problem?.codeSnippets) {
      // Fallback to any available language
      const availableLanguages = Object.keys(problem.codeSnippets)
      if (availableLanguages.length > 0) {
        const fallbackLang = availableLanguages[0]
        console.log("Using fallback language:", fallbackLang)
        setCode(problem.codeSnippets[fallbackLang])
      }
    }
  }, [problem, language])

  // Clear results when problem changes
  useEffect(() => {
    if (problem?.id) {
      clearResults()
      clearError()
    }
  }, [problem?.id, clearResults, clearError])

  // Save theme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("editor-theme", theme)
    }
  }, [theme])

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running")
      return
    }

    if (!problem?.id) {
      toast.error("Problem ID not found")
      return
    }

    try {
      const languageId = getLanguageId(language)
      console.log("Running code:", { code, languageId, problemId: problem.id })

      // Pass problem data to get actual inputs for display
      const results = await runCode(code, languageId, problem.id, problem)
      console.log("Run results:", results)
    } catch (error) {
      console.error("Failed to run code:", error)
      // Error is already handled in the store
    }
  }

  // Add state for submission result
  const [submissionResult, setSubmissionResult] = useState(null)

  // Update the handleSubmit function to handle the new response format
  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting")
      return
    }

    if (!problem?.id) {
      toast.error("Problem ID not found")
      return
    }

    try {
      const languageId = getLanguageId(language)
      console.log("Submitting code:", { code, languageId, problemId: problem.id })

      // Pass problem data to get actual inputs for display
      const submissionResult = await submitCode(code, languageId, problem.id, problem)
      console.log("Submit results:", submissionResult)

      // Show success modal with detailed results
      if (submissionResult) {
        setShowSuccess(true)
        // Store the submission result for the success modal
        setSubmissionResult(submissionResult)
      }
    } catch (error) {
      console.error("Failed to submit code:", error)
      // Error is already handled in the store
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    if (problem?.codeSnippets?.[newLanguage]) {
      setCode(problem.codeSnippets[newLanguage])
    }
  }

  // Reset to original template
  const handleResetCode = () => {
    if (problem?.originalCodeSnippets?.[language]) {
      setCode(problem.originalCodeSnippets[language])
    }
  }

  // Horizontal resizer functionality
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true)
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain between 25% and 75%
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 25), 75)
      setLeftWidth(constrainedWidth)
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Double-click to reset to 50/50
  const handleDoubleClick = useCallback(() => {
    setLeftWidth(50)
  }, [])

  // Add event listeners for horizontal resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      document.body.style.pointerEvents = "none"

      // Re-enable pointer events on the resizer
      const resizer = document.querySelector(".horizontal-resizer")
      if (resizer) {
        resizer.style.pointerEvents = "auto"
      }
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      document.body.style.pointerEvents = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      document.body.style.pointerEvents = ""
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Don't render until we have problem data
  if (!problem) {
    console.log("No problem data, showing loading...")
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <span className="ml-3 text-gray-400">Loading problem...</span>
      </div>
    )
  }

  console.log("Rendering problem page with data:", problem)

  // Get current test results (prioritize submit results over run results)
  const currentTestResults = submitResults?.results || runResults

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Navigation Header */}
      <motion.div
        className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3 flex items-center justify-between relative z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {/* Navigation Buttons with Better Styling */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 backdrop-blur-sm"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <Link
            to="/problems"
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 backdrop-blur-sm"
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">Problems</span>
          </Link>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-600/50 mx-2" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ArrowLeft className="w-4 h-4" />
            <span>Problem</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-300 font-medium">{problem.title}</span>
            {problem.hasPreviousSubmission && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                  Previous Solution Loaded
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Error indicator */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              <span className="text-xs">Error occurred</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-300">
                ×
              </button>
            </div>
          )}

          {/* Reset Code Button */}
          {problem.hasPreviousSubmission && (
            <button
              onClick={handleResetCode}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
              title="Reset to original template"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          )}

          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
            >
              {React.createElement(themes.find((t) => t.id === theme)?.icon || Moon, { className: "w-4 h-4" })}
              <span className="text-sm">{themes.find((t) => t.id === theme)?.name}</span>
            </button>

            {/* Theme Menu */}
            {showThemeMenu && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-30"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id)
                        setShowThemeMenu(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        theme === themeOption.id
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      {React.createElement(themeOption.icon, { className: "w-4 h-4" })}
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{themeOption.name}</div>
                        <div className="text-xs text-gray-500">{themeOption.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Layout Presets */}
          <div className="flex items-center gap-1 bg-gray-700/30 rounded-lg p-1 border border-gray-600/30">
            <button
              onClick={() => setLeftWidth(25)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(leftWidth - 25) < 5
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-600/50"
              }`}
              title="25/75 Split"
            >
              25
            </button>
            <button
              onClick={() => setLeftWidth(50)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(leftWidth - 50) < 5
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-600/50"
              }`}
              title="50/50 Split"
            >
              50
            </button>
            <button
              onClick={() => setLeftWidth(75)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                Math.abs(leftWidth - 75) < 5
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-600/50"
              }`}
              title="75/25 Split"
            >
              75
            </button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-700/20 px-3 py-2 rounded-lg border border-gray-600/20">
            <kbd className="px-2 py-1 bg-gray-600/50 rounded text-xs border border-gray-500/30">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-600/50 rounded text-xs border border-gray-500/30">Enter</kbd>
            <span>Run</span>
          </div>
        </div>
      </motion.div>

      {/* Click outside to close theme menu */}
      {showThemeMenu && <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />}

      {/* Global Keyboard Shortcuts */}
      <EditorShortcuts onRun={handleRun} onSubmit={handleSubmit} />

      {/* Main Content */}
      <div ref={containerRef} className="flex-1 flex relative">
        {/* Problem Details - Left Side */}
        <motion.div
          className="bg-gray-800/30 border-r border-gray-700/50 overflow-hidden flex-shrink-0"
          style={{ width: `${leftWidth}%` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProblemDetails problem={problem} />
        </motion.div>

        {/* Horizontal Resizer */}
        <div
          className={`horizontal-resizer w-1 bg-gray-700/50 hover:bg-orange-500/50 cursor-col-resize transition-colors relative group flex-shrink-0 ${
            isResizing ? "bg-orange-500/70" : ""
          }`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Double-click to reset to 50/50"
        >
          <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-orange-500/20 transition-colors" />
          {/* Visual indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500/50 rounded-full group-hover:bg-orange-400/70 transition-colors" />
        </div>

        {/* Code Editor - Right Side */}
        <motion.div
          className="bg-gray-800/30 overflow-hidden flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            testResults={currentTestResults}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            theme={theme}
            problem={problem}
          />
        </motion.div>
      </div>

      {/* Submission Results Modal */}
      {showSuccess && (
        <SubmissionResultsModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          problem={problem}
          submissionResult={submissionResult}
        />
      )}
    </div>
  )
}

export default ProblemPage
