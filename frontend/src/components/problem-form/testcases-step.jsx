"use client"

import { useFieldArray } from "react-hook-form"
import { Plus, Trash2, TestTube } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export function TestCasesStep({ form }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testcases",
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Test Cases</h3>
              <p className="text-sm text-gray-400">Add test cases to validate solutions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => append({ input: "", output: "" })}
            className="btn bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Test Case
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300">
                  <div className="card-header flex flex-row items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs text-purple-400 font-medium">{index + 1}</span>
                      </div>
                      <h3 className="text-sm text-white font-medium">Test Case {index + 1}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-ghost btn-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="card-body p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Input</label>
                        <input
                          {...form.register(`testcases.${index}.input`)}
                          placeholder="100 200"
                          className="input input-bordered w-full bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Expected Output</label>
                        <input
                          {...form.register(`testcases.${index}.output`)}
                          placeholder="300"
                          className="input input-bordered w-full bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
