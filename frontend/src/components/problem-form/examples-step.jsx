"use client"

import { useFieldArray } from "react-hook-form"
import { Plus, Trash2, Lightbulb, Settings, Clock, Database, Zap } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export function ExamplesStep({ form }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "examples",
  })

  return (
    <div className="space-y-8">
      {/* Constraints Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-400" />
            <label className="text-sm font-medium text-white">Constraints</label>
          </div>
          <textarea
            {...form.register("constraints")}
            placeholder="e.g., -10^9 ≤ a, b ≤ 10^9"
            rows={3}
            className="textarea textarea-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 resize-none"
          />
          {form.formState.errors.constraints && (
            <motion.p className="text-red-400 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {form.formState.errors.constraints.message}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-white">Max Input Size</label>
            </div>
            <input
              type="number"
              {...form.register("maxInputSize", { valueAsNumber: true })}
              placeholder="1000000000"
              className="input input-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <label className="text-sm font-medium text-white">Expected Time Complexity</label>
            </div>
            <input
              {...form.register("expectedTimeComplexity")}
              placeholder="O(1)"
              className="input input-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" />
              <label className="text-sm font-medium text-white">Time Limit (optional)</label>
            </div>
            <input
              {...form.register("expectedTimeLimit")}
              placeholder="1s"
              className="input input-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <label className="text-sm font-medium text-white">Memory Limit (optional)</label>
            </div>
            <input
              {...form.register("expectedMemoryLimit")}
              placeholder="256MB"
              className="input input-bordered w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Examples Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Examples</h3>
          </div>
          <button
            type="button"
            onClick={() => append({ input: "", output: "", explanation: "" })}
            className="btn bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Example
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
                <div className="card bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 hover:border-orange-500/30 transition-all duration-300">
                  <div className="card-header flex flex-row items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <span className="text-xs text-orange-400 font-medium">{index + 1}</span>
                      </div>
                      <h3 className="text-sm text-white font-medium">Example {index + 1}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-ghost btn-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="card-body p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Input</label>
                        <input
                          {...form.register(`examples.${index}.input`)}
                          placeholder="3 7"
                          className="input input-bordered w-full bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Output</label>
                        <input
                          {...form.register(`examples.${index}.output`)}
                          placeholder="10"
                          className="input input-bordered w-full bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Explanation</label>
                      <textarea
                        {...form.register(`examples.${index}.explanation`)}
                        placeholder="Adding 3 and 7 gives 10."
                        rows={2}
                        className="textarea textarea-bordered w-full bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 resize-none"
                      />
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
