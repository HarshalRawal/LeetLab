"use client"

import { useRef, useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

const MonacoEditorPanel = ({ code, setCode, language, theme = "dark" }) => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Define custom themes
    const themes = {
      "leetcode-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "regexp", foreground: "D16969" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "namespace", foreground: "4EC9B0" },
          { token: "type", foreground: "4EC9B0" },
          { token: "struct", foreground: "4EC9B0" },
          { token: "class", foreground: "4EC9B0" },
          { token: "interface", foreground: "B8D7A3" },
          { token: "parameter", foreground: "9CDCFE" },
          { token: "variable", foreground: "9CDCFE" },
          { token: "property", foreground: "9CDCFE" },
          { token: "enumMember", foreground: "4FC1FF" },
          { token: "function", foreground: "DCDCAA" },
          { token: "member", foreground: "DCDCAA" },
        ],
        colors: {
          "editor.background": "#1a1a1a",
          "editor.foreground": "#d4d4d4",
          "editorLineNumber.foreground": "#858585",
          "editorLineNumber.activeForeground": "#c6c6c6",
          "editor.selectionBackground": "#264f78",
          "editor.selectionHighlightBackground": "#add6ff26",
          "editor.wordHighlightBackground": "#575757b8",
          "editor.wordHighlightStrongBackground": "#004972b8",
          "editorCursor.foreground": "#aeafad",
          "editor.lineHighlightBackground": "#2a2a2a",
          "editorWhitespace.foreground": "#404040",
          "editorIndentGuide.background": "#404040",
          "editorIndentGuide.activeBackground": "#707070",
          "editor.findMatchBackground": "#515c6a",
          "editor.findMatchHighlightBackground": "#ea5c0055",
          "editor.findRangeHighlightBackground": "#3a3d4166",
          "editorHoverWidget.background": "#252526",
          "editorHoverWidget.border": "#454545",
          "editorSuggestWidget.background": "#252526",
          "editorSuggestWidget.border": "#454545",
          "editorSuggestWidget.selectedBackground": "#094771",
          "scrollbarSlider.background": "#79797966",
          "scrollbarSlider.hoverBackground": "#646464b3",
          "scrollbarSlider.activeBackground": "#bfbfbf66",
          "editorBracketMatch.background": "#0064001a",
          "editorBracketMatch.border": "#888888",
          "editorBracketHighlight.foreground1": "#FFD700",
          "editorBracketHighlight.foreground2": "#DA70D6",
          "editorBracketHighlight.foreground3": "#179fff",
          "editorBracketHighlight.unexpectedBracket.foreground": "#FF0000",
        },
      },
      "leetcode-light": {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "keyword", foreground: "0000FF" },
          { token: "string", foreground: "A31515" },
          { token: "number", foreground: "098658" },
          { token: "regexp", foreground: "811F3F" },
          { token: "operator", foreground: "000000" },
          { token: "namespace", foreground: "267F99" },
          { token: "type", foreground: "267F99" },
          { token: "struct", foreground: "267F99" },
          { token: "class", foreground: "267F99" },
          { token: "interface", foreground: "007ACC" },
          { token: "parameter", foreground: "001080" },
          { token: "variable", foreground: "001080" },
          { token: "property", foreground: "001080" },
          { token: "enumMember", foreground: "0070C1" },
          { token: "function", foreground: "795E26" },
          { token: "member", foreground: "795E26" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editorLineNumber.foreground": "#237893",
          "editorLineNumber.activeForeground": "#0B216F",
          "editor.selectionBackground": "#ADD6FF",
          "editor.selectionHighlightBackground": "#ADD6FF4D",
          "editor.wordHighlightBackground": "#57575740",
          "editor.wordHighlightStrongBackground": "#0047724D",
          "editorCursor.foreground": "#000000",
          "editor.lineHighlightBackground": "#F0F0F0",
          "editorBracketMatch.background": "#0064001a",
          "editorBracketMatch.border": "#B9B9B9",
        },
      },
      "leetcode-high-contrast": {
        base: "hc-black",
        inherit: true,
        rules: [
          { token: "comment", foreground: "7CA668", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "function", foreground: "DCDCAA" },
        ],
        colors: {
          "editor.background": "#000000",
          "editor.foreground": "#FFFFFF",
          "editorLineNumber.foreground": "#FFFFFF",
          "editorLineNumber.activeForeground": "#FFFFFF",
          "editor.selectionBackground": "#FFFFFF40",
          "editorCursor.foreground": "#FFFFFF",
          "editor.lineHighlightBackground": "#FFFFFF0A",
          "editorBracketMatch.background": "#FFFFFF20",
          "editorBracketMatch.border": "#FFFFFF",
        },
      },
      "leetcode-monokai": {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "75715E", fontStyle: "italic" },
          { token: "keyword", foreground: "F92672" },
          { token: "string", foreground: "E6DB74" },
          { token: "number", foreground: "AE81FF" },
          { token: "regexp", foreground: "FD971F" },
          { token: "operator", foreground: "F8F8F2" },
          { token: "function", foreground: "A6E22E" },
          { token: "variable", foreground: "F8F8F2" },
          { token: "type", foreground: "66D9EF" },
          { token: "class", foreground: "A6E22E" },
        ],
        colors: {
          "editor.background": "#272822",
          "editor.foreground": "#F8F8F2",
          "editorLineNumber.foreground": "#90908A",
          "editorLineNumber.activeForeground": "#F8F8F2",
          "editor.selectionBackground": "#49483E",
          "editor.selectionHighlightBackground": "#49483E80",
          "editor.wordHighlightBackground": "#4A4A76",
          "editor.wordHighlightStrongBackground": "#6A6A9A",
          "editorCursor.foreground": "#F8F8F0",
          "editor.lineHighlightBackground": "#3E3D32",
          "editorBracketMatch.background": "#49483E",
          "editorBracketMatch.border": "#888888",
        },
      },
    }

    // Register all themes
    Object.entries(themes).forEach(([name, themeData]) => {
      monaco.editor.defineTheme(name, themeData)
    })

    // Set the appropriate theme
    const getThemeName = (themeId) => {
      switch (themeId) {
        case "light":
          return "leetcode-light"
        case "high-contrast":
          return "leetcode-high-contrast"
        case "monokai":
          return "leetcode-monokai"
        default:
          return "leetcode-dark"
      }
    }

    monaco.editor.setTheme(getThemeName(theme))

    // Configure language-specific settings
    if (language === "javascript") {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      })

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })
    }

    // Set editor as ready and focus it
    setIsEditorReady(true)

    // Focus the editor after a small delay to ensure it's fully mounted
    setTimeout(() => {
      editor.focus()
    }, 100)
  }

  const handleEditorChange = (value) => {
    setCode(value || "")
  }

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current && window.monaco && isEditorReady) {
      const getThemeName = (themeId) => {
        switch (themeId) {
          case "light":
            return "leetcode-light"
          case "high-contrast":
            return "leetcode-high-contrast"
          case "monokai":
            return "leetcode-monokai"
          default:
            return "leetcode-dark"
        }
      }

      window.monaco.editor.setTheme(getThemeName(theme))
    }
  }, [theme, isEditorReady])

  // Force editor to resize when container changes
  useEffect(() => {
    const resizeEditor = () => {
      if (editorRef.current && isEditorReady) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          editorRef.current.layout()
        })
      }
    }

    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      resizeEditor()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Also listen for window resize
    window.addEventListener("resize", resizeEditor)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", resizeEditor)
    }
  }, [isEditorReady])

  // Update editor when language changes
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      const model = editorRef.current.getModel()
      if (model) {
        const monaco = window.monaco
        if (monaco) {
          monaco.editor.setModelLanguage(model, getLanguageId(language))
        }
      }
    }
  }, [language, isEditorReady])

  const getLanguageId = (lang) => {
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
  }

  const editorOptions = {
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', monospace",
    lineNumbers: "on",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: false, // We'll handle this manually
    tabSize: 4,
    insertSpaces: true,
    wordWrap: "on",
    lineHeight: 22,
    padding: { top: 16, bottom: 16 },
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    parameterHints: { enabled: true },
    hover: { enabled: true },
    contextmenu: true,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    glyphMargin: false,
    folding: true,
    showFoldingControls: "mouseover",
    matchBrackets: "always",
    renderWhitespace: "selection",
    bracketPairColorization: {
      enabled: true,
      independentColorPoolPerBracketType: false,
    },
    guides: {
      bracketPairs: "active",
      bracketPairsHorizontal: false,
      highlightActiveBracketPair: true,
      indentation: true,
    },
    occurrencesHighlight: false,
    selectionHighlight: true,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    renderLineHighlight: "line",
    smoothScrolling: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: true,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: "never",
      seedSearchStringFromSelection: "always",
    },
    "semanticHighlighting.enabled": false,
  }

  const getBackgroundColor = () => {
    switch (theme) {
      case "light":
        return "#ffffff"
      case "high-contrast":
        return "#000000"
      case "monokai":
        return "#272822"
      default:
        return "#1a1a1a"
    }
  }

  // Show a loading state with the correct background color
  const LoadingComponent = () => (
    <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: getBackgroundColor() }}>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Loading editor...</span>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="h-full w-full" style={{ backgroundColor: getBackgroundColor() }}>
      <Editor
        height="100%"
        language={getLanguageId(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={editorOptions}
        theme={
          theme === "light"
            ? "leetcode-light"
            : theme === "high-contrast"
              ? "leetcode-high-contrast"
              : theme === "monokai"
                ? "leetcode-monokai"
                : "leetcode-dark"
        }
        loading={<LoadingComponent />}
        // Ensure the editor loads immediately
        beforeMount={(monaco) => {
          // Pre-configure Monaco before mounting
          monaco.editor.setTheme("vs-dark")
        }}
      />
    </div>
  )
}

export default MonacoEditorPanel
