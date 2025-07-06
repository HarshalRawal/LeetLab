"use client"

import { useEffect } from "react"

const EditorShortcuts = ({ onRun, onSubmit }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onRun()
      }

      // Ctrl/Cmd + Shift + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onRun, onSubmit])

  return null
}

export default EditorShortcuts
