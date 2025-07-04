import { useState } from "react"
import { Zap } from "lucide-react"
import { motion } from "motion/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

export function ReferenceSolutionsStep({ form }) {
  const [activeTab, setActiveTab] = useState("javascript")
  const [previewMode, setPreviewMode] = useState({})

  const languages = [
    { id: "javascript", name: "JavaScript", key: "JAVASCRIPT", syntax: "javascript" },
    { id: "python", name: "Python", key: "PYTHON", syntax: "python" },
    { id: "java", name: "Java", key: "JAVA", syntax: "java" },
  ]

  const togglePreview = (langId) => {
    setPreviewMode((prev) => ({
      ...prev,
      [langId]: !prev[langId],
    }))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Reference Solutions</h3>
            <p className="text-sm text-gray-400">Provide complete working solutions for each language</p>
          </div>
        </div>

        <div className="tabs tabs-boxed bg-gray-800/50 p-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setActiveTab(lang.id)}
              className={`tab transition-all duration-300 ${
                activeTab === lang.id
                  ? "tab-active bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {languages.map((lang) => (
            <div key={lang.id} className={activeTab === lang.id ? "block" : "hidden"}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white">{lang.name} Reference Solution</label>
                  <button
                    type="button"
                    onClick={() => togglePreview(lang.id)}
                    className="btn btn-sm bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border-gray-600/50"
                  >
                    {previewMode[lang.id] ? "Edit" : "Preview"}
                  </button>
                </div>

                {previewMode[lang.id] ? (
                  <div className="bg-gray-900 rounded-lg border border-gray-700/50 overflow-hidden">
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
                      {form.watch(`referenceSolutions.${lang.key}`) || `// Enter complete ${lang.name} solution...`}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <textarea
                    {...form.register(`referenceSolutions.${lang.key}`)}
                    placeholder={`Enter complete ${lang.name} solution...`}
                    rows={10}
                    className="textarea textarea-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 font-mono text-sm resize-none"
                  />
                )}

                {form.formState.errors.referenceSolutions?.[lang.key] && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.referenceSolutions[lang.key].message}
                  </p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
