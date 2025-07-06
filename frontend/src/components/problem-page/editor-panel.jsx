"use client"

import { useEffect, useRef, useCallback } from "react"
import * as monaco from "monaco-editor"

const EditorPanel = ({ code, setCode, language }) => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  const getMonacoLanguage = useCallback((lang) => {
    switch (lang) {
      case "javascript":
        return "javascript"
      case "python":
        return "python"
      case "java":
        return "java"
      default:
        return "javascript"
    }
  }, [])

  // Initialize Editor
  useEffect(() => {
    if (!containerRef.current) return

    const editor = monaco.editor.create(containerRef.current, {
      value: code,
      language: getMonacoLanguage(language),
      theme: "vs-dark",
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      lineNumbers: "on",
      minimap: { enabled: false },
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: "on",
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      suggestOnTriggerCharacters: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      parameterHints: { enabled: true },
      hover: { enabled: true },
      contextmenu: true,
      selectOnLineNumbers: true,
      cursorStyle: "line",
      folding: true,
      showFoldingControls: "mouseover",
      matchBrackets: "always",
      renderWhitespace: "selection",
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    })

    editorRef.current = editor

    const disposable = editor.onDidChangeModelContent(() => {
      setCode(editor.getValue())
    })

    return () => {
      disposable.dispose()
      editor.dispose()
    }
  }, [getMonacoLanguage, language])

  // Handle language change
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setModelLanguage(
        editorRef.current.getModel(),
        getMonacoLanguage(language)
      )
    }
  }, [language, getMonacoLanguage])

  // Handle external code changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code)
    }
  }, [code])

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}

export default EditorPanel
