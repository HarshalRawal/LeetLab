"use client"

import { useState } from "react"
import { X, Code2, Lightbulb, Clock, Database, Zap, TestTube, FileText, Hash, BarChart3 } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export function ProblemPreview({ problemData, onClose }) {
  const [activeCodeTab, setActiveCodeTab] = useState("javascript")
  const [activeSolutionTab, setActiveSolutionTab] = useState("javascript")

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "HARD":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const languages = [
    { id: "javascript", name: "JavaScript", key: "JAVASCRIPT", syntax: "javascript" },
    { id: "python", name: "Python", key: "PYTHON", syntax: "python" },
    { id: "java", name: "Java", key: "JAVA", syntax: "java" },
  ]

  const hasCodeSnippets = languages.some((lang) => problemData.codeSnippets?.[lang.key]?.trim())
  const hasReferenceSolutions = languages.some((lang) => problemData.referenceSolutions?.[lang.key]?.trim())

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 text-white max-h-[90vh]">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-800/95 backdrop-blur-xl z-10 pb-4 border-b border-gray-700/30">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            Problem Preview
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto pr-2">
          {/* Title and Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-bold text-white">{problemData.title || "Untitled Problem"}</h1>
              <div
                className={`badge ${getDifficultyColor(problemData.difficulty)} border px-3 py-2 text-sm font-medium`}
              >
                {problemData.difficulty}
              </div>
            </div>

            {/* Tags */}
            {problemData.tags && problemData.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-gray-400">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {problemData.tags.map((tag, index) => (
                    <div key={index} className="badge bg-gray-700/50 text-gray-300 border-gray-600/50">
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {problemData.description && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Problem Description</h3>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{problemData.description}</p>
              </div>
            </div>
          )}

          {/* Examples */}
          {problemData.examples && problemData.examples.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Examples</h3>
              </div>
              <div className="space-y-4">
                {problemData.examples.map((example, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      Example {index + 1}
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-400 block mb-1">Input:</span>
                          <code className="block bg-gray-800/50 px-3 py-2 rounded text-sm font-mono text-white border border-gray-600/30">
                            {example.input || "No input provided"}
                          </code>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-400 block mb-1">Output:</span>
                          <code className="block bg-gray-800/50 px-3 py-2 rounded text-sm font-mono text-white border border-gray-600/30">
                            {example.output || "No output provided"}
                          </code>
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-sm font-medium text-gray-400 block mb-1">Explanation:</span>
                          <p className="text-sm text-gray-300 bg-gray-800/30 px-3 py-2 rounded border border-gray-600/30">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints and Limits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Constraints & Limits</h3>
            </div>

            {problemData.constraints && (
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Constraints:</h4>
                <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{problemData.constraints}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {problemData.maxInputSize && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-400">Max Input Size</span>
                  </div>
                  <code className="text-white font-mono text-sm">{problemData.maxInputSize.toLocaleString()}</code>
                </div>
              )}
              {problemData.expectedTimeComplexity && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-400">Time Complexity</span>
                  </div>
                  <code className="text-white font-mono text-sm">{problemData.expectedTimeComplexity}</code>
                </div>
              )}
              {problemData.expectedTimeLimit && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-400">Time Limit</span>
                  </div>
                  <code className="text-white font-mono text-sm">{problemData.expectedTimeLimit}</code>
                </div>
              )}
              {problemData.expectedMemoryLimit && (
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-400">Memory Limit</span>
                  </div>
                  <code className="text-white font-mono text-sm">{problemData.expectedMemoryLimit}</code>
                </div>
              )}
            </div>
          </div>

          {/* Test Cases */}
          {problemData.testcases && problemData.testcases.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Test Cases</h3>
                <div className="badge bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {problemData.testcases.length} cases
                </div>
              </div>
              <div className="grid gap-4">
                {problemData.testcases.map((testcase, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      Test Case {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-400 block mb-1">Input:</span>
                        <code className="block bg-gray-800/50 px-3 py-2 rounded text-sm font-mono text-white border border-gray-600/30">
                          {testcase.input || "No input provided"}
                        </code>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-400 block mb-1">Expected Output:</span>
                        <code className="block bg-gray-800/50 px-3 py-2 rounded text-sm font-mono text-white border border-gray-600/30">
                          {testcase.output || "No output provided"}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Templates */}
          {hasCodeSnippets && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Code Templates</h3>
              </div>

              <div className="tabs tabs-boxed bg-gray-800/50 p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveCodeTab(lang.id)}
                    disabled={!problemData.codeSnippets?.[lang.key]?.trim()}
                    className={`tab transition-all duration-300 ${
                      activeCodeTab === lang.id
                        ? "tab-active bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : problemData.codeSnippets?.[lang.key]?.trim()
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {lang.name}
                    {problemData.codeSnippets?.[lang.key]?.trim() && (
                      <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.id} className={activeCodeTab === lang.id ? "block" : "hidden"}>
                    {problemData.codeSnippets?.[lang.key]?.trim() ? (
                      <div className="bg-gray-900 rounded-lg border border-gray-700/50 overflow-hidden">
                        <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50">
                          <span className="text-sm font-medium text-gray-300">{lang.name} Template</span>
                        </div>
                        <SyntaxHighlighter
                          language={lang.syntax}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            background: "transparent",
                            fontSize: "14px",
                          }}
                        >
                          {problemData.codeSnippets[lang.key]}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <div className="bg-gray-700/30 rounded-lg p-8 border border-gray-600/30 text-center">
                        <Code2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No {lang.name} template provided</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Solutions */}
          {hasReferenceSolutions && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Reference Solutions</h3>
              </div>

              <div className="tabs tabs-boxed bg-gray-800/50 p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveSolutionTab(lang.id)}
                    disabled={!problemData.referenceSolutions?.[lang.key]?.trim()}
                    className={`tab transition-all duration-300 ${
                      activeSolutionTab === lang.id
                        ? "tab-active bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : problemData.referenceSolutions?.[lang.key]?.trim()
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {lang.name}
                    {problemData.referenceSolutions?.[lang.key]?.trim() && (
                      <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.id} className={activeSolutionTab === lang.id ? "block" : "hidden"}>
                    {problemData.referenceSolutions?.[lang.key]?.trim() ? (
                      <div className="bg-gray-900 rounded-lg border border-gray-700/50 overflow-hidden">
                        <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50">
                          <span className="text-sm font-medium text-gray-300">{lang.name} Solution</span>
                        </div>
                        <SyntaxHighlighter
                          language={lang.syntax}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            background: "transparent",
                            fontSize: "14px",
                          }}
                        >
                          {problemData.referenceSolutions[lang.key]}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <div className="bg-gray-700/30 rounded-lg p-8 border border-gray-600/30 text-center">
                        <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No {lang.name} solution provided</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-gray-700/20 rounded-lg p-6 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Problem Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">{problemData.examples?.length || 0}</div>
                <div className="text-sm text-gray-400">Examples</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{problemData.testcases?.length || 0}</div>
                <div className="text-sm text-gray-400">Test Cases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {languages.filter((lang) => problemData.codeSnippets?.[lang.key]?.trim()).length}
                </div>
                <div className="text-sm text-gray-400">Code Templates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {languages.filter((lang) => problemData.referenceSolutions?.[lang.key]?.trim()).length}
                </div>
                <div className="text-sm text-gray-400">Solutions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action sticky bottom-0 bg-gray-800/95 backdrop-blur-xl pt-4 border-t border-gray-700/30 mt-8">
          <button
            onClick={onClose}
            className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}
