"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import MonacoEditorPanel from "./monaco-editor-panel"
import EditorControls from "./editor-controls"
import TestCasePanel from "./test-case-panel"

const CodeEditor = ({
  code,
  setCode,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  testResults,
  isRunning,
  isSubmitting,
  theme = "dark",
  problem,
}) => {
  const [bottomHeight, setBottomHeight] = useState(40) // Percentage of editor area
  const [isResizing, setIsResizing] = useState(false)
  const [showTestCases, setShowTestCases] = useState(true)

  const editorContainerRef = useRef(null)

  const handleRun = () => {
    onRun()
  }

  // Vertical resizer functionality
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true)
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing || !editorContainerRef.current) return

      const containerRect = editorContainerRef.current.getBoundingClientRect()
      const newBottomHeight = ((containerRect.bottom - e.clientY) / containerRect.height) * 100

      // Constrain between 20% and 70%
      const constrainedHeight = Math.min(Math.max(newBottomHeight, 20), 70)
      setBottomHeight(constrainedHeight)
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Double-click to reset to 40%
  const handleDoubleClick = useCallback(() => {
    setBottomHeight(40)
  }, [])

  // Add event listeners for vertical resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "row-resize"
      document.body.style.userSelect = "none"
      document.body.style.pointerEvents = "none"

      // Re-enable pointer events on the resizer
      const resizer = document.querySelector(".vertical-resizer")
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

  return (
    <div ref={editorContainerRef} className="h-full flex flex-col">
      {/* Editor Controls - Fixed */}
      <div className="flex-shrink-0">
        <EditorControls
          language={language}
          onLanguageChange={onLanguageChange}
          onRun={handleRun}
          onSubmit={onSubmit}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          theme={theme}
        />
      </div>

      {/* Editor Area - Flexible with proper scroll handling */}
      <div className="flex-1 flex flex-col relative min-h-0">
        {/* Monaco Code Editor - Has its own scrolling */}
        <div
          className="flex-shrink-0 min-h-0"
          style={{
            height: showTestCases ? `${100 - bottomHeight}%` : "100%",
            backgroundColor:
              theme === "light"
                ? "#ffffff"
                : theme === "high-contrast"
                  ? "#000000"
                  : theme === "monokai"
                    ? "#272822"
                    : "#1a1a1a",
          }}
        >
          <MonacoEditorPanel code={code} setCode={setCode} language={language} theme={theme} />
        </div>

        {/* Vertical Resizer */}
        {showTestCases && (
          <div
            className={`vertical-resizer h-1 bg-gray-700/50 hover:bg-orange-500/50 cursor-row-resize transition-colors relative group flex-shrink-0 z-10 ${
              isResizing ? "bg-orange-500/70" : ""
            }`}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            title="Double-click to reset split"
          >
            <div className="absolute inset-x-0 -top-2 -bottom-2 group-hover:bg-orange-500/20 transition-colors" />
            {/* Visual indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-8 bg-gray-500/50 rounded-full group-hover:bg-orange-400/70 transition-colors" />
          </div>
        )}

        {/* Test Case Panel - Has its own scrolling */}
        {showTestCases && (
          <motion.div
            className="bg-gray-800/50 flex-shrink-0 min-h-0"
            style={{ height: `${bottomHeight}%` }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: `${bottomHeight}%` }}
            transition={{ duration: 0.3 }}
          >
            <TestCasePanel
              results={testResults}
              isRunning={isRunning}
              onClose={() => setShowTestCases(false)}
              problem={problem}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
