"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { problemSchema } from "../../Schema/problem.schema"
import { createProblem } from "../../services/problem.services"
import { handleApiError } from "../../libs/handleApiError"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Lightbulb,
  TestTube,
  Code2,
  Zap,
  Star,
  Sparkles,
  Eye,
  Save,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom";
import { BasicInfoStep } from "./basic-info-step"
import { ExamplesStep } from "./examples-step"
import { TestCasesStep } from "./testcases-step"
import { CodeSnippetsStep } from "./code-snippets-step"
import { ReferenceSolutionsStep } from "./reference-solutions-step"
import { ProblemPreview } from "./problem-preview"
import { toast } from "react-toastify"

const steps = [
  {
    id: 1,
    title: "Basic Info",
    component: BasicInfoStep,
    icon: FileText,
    description: "Problem details and metadata",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: 2,
    title: "Examples",
    component: ExamplesStep,
    icon: Lightbulb,
    description: "Examples and constraints",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    id: 3,
    title: "Test Cases",
    component: TestCasesStep,
    icon: TestTube,
    description: "Validation test cases",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: 4,
    title: "Code Snippets",
    component: CodeSnippetsStep,
    icon: Code2,
    description: "Starter code templates",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    id: 5,
    title: "Solutions",
    component: ReferenceSolutionsStep,
    icon: Zap,
    description: "Reference solutions",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
]

const STORAGE_KEY = "problem-form-data"
const AUTO_SAVE_DELAY = 2000 // 2 seconds

export function ProblemForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved") // 'saving', 'saved', 'error'
  const [isSubmitted, setIsSubmitted] = useState(false) // Add this line

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [],
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: "",
      maxInputSize: 1000000000,
      expectedTimeComplexity: "",
      expectedTimeLimit: "",
      expectedMemoryLimit: "",
      testcases: [{ input: "", output: "" }],
      codeSnippets: {
        JAVASCRIPT: "",
        PYTHON: "",
        JAVA: "",
      },
      referenceSolutions: {
        JAVASCRIPT: "",
        PYTHON: "",
        JAVA: "",
      },
    },
  })

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        Object.keys(parsedData.formData).forEach((key) => {
          form.setValue(key, parsedData.formData[key])
        })
        setCurrentStep(parsedData.currentStep || 1)
        setLastSaved(new Date(parsedData.timestamp))
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [form])

  // Auto-save functionality
  useEffect(() => {
    // Don't auto-save if form has been successfully submitted
    if (isSubmitted) return

    const subscription = form.watch((data) => {
      setAutoSaveStatus("saving")
      const timeoutId = setTimeout(() => {
        try {
          const saveData = {
            formData: data,
            currentStep,
            timestamp: new Date().toISOString(),
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData))
          setLastSaved(new Date())
          setAutoSaveStatus("saved")
        } catch (error) {
          console.error("Auto-save error:", error)
          setAutoSaveStatus("error")
        }
      }, AUTO_SAVE_DELAY)

      return () => clearTimeout(timeoutId)
    })

    return () => subscription.unsubscribe()
  }, [form, currentStep, isSubmitted])

  const navigateToStep = async (stepId) => {
    if (stepId === currentStep) return

    // If going forward, validate current step
    if (stepId > currentStep) {
      const fieldsToValidate = getFieldsForStep(currentStep)
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) return
    }

    setCurrentStep(stepId)
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["title", "description", "difficulty", "tags"]
      case 2:
        return ["examples", "constraints", "maxInputSize", "expectedTimeComplexity"]
      case 3:
        return ["testcases"]
      case 4:
        return ["codeSnippets"]
      case 5:
        return ["referenceSolutions"]
      default:
        return []
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      console.log("Problem data:", data)
      const response = await createProblem(data)
      console.log(response)

      // Set submitted state to prevent further auto-saves
      setIsSubmitted(true)

      // Clear saved data after successful submission
      localStorage.removeItem(STORAGE_KEY)

      // Show success message
      toast.success(response.message || "Problem-created-successfully!")

      // Navigate back to homepage after a short delay
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      console.error("Error creating problem:", error)
      handleApiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY)
    form.reset()
    setCurrentStep(1)
    setLastSaved(null)
  }

  const CurrentStepComponent = steps[currentStep - 1].component
  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 4 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Problem Creator</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">Create </span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Coding
            </span>
            <br />
            <span className="text-white">Challenge</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Design comprehensive coding problems with examples, test cases, and solutions
          </p>
        </motion.div>

        {/* Auto-save Status */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 text-sm ${
                autoSaveStatus === "saving"
                  ? "text-yellow-400"
                  : autoSaveStatus === "saved"
                    ? "text-green-400"
                    : "text-red-400"
              }`}
            >
              <Save className="w-4 h-4" />
              {autoSaveStatus === "saving" && "Saving..."}
              {autoSaveStatus === "saved" && lastSaved && `Saved ${lastSaved.toLocaleTimeString()}`}
              {autoSaveStatus === "error" && "Save failed"}
            </div>

            {/* Success message */}
            {isSubmitted && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="w-4 h-4" />
                Problem created! Redirecting to homepage...
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={isSubmitted}
              className="btn btn-outline border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-orange-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            {lastSaved && !isSubmitted && (
              <button
                type="button"
                onClick={clearSavedData}
                className="btn btn-outline border-red-700/50 text-red-400 hover:bg-red-700/50 hover:text-white hover:border-red-500/30 transition-all duration-300"
              >
                Clear Draft
              </button>
            )}
            {/* Add Home button */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-outline border-blue-700/50 text-blue-400 hover:bg-blue-700/50 hover:text-white hover:border-blue-500/30 transition-all duration-300"
            >
              🏠 Home
            </button>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex justify-between mb-6 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`flex flex-col items-center min-w-0 flex-1 cursor-pointer ${index < steps.length - 1 ? "mr-4" : ""}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigateToStep(step.id)}
              >
                <div className="flex items-center w-full mb-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      step.id < currentStep
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                        : step.id === currentStep
                          ? `${step.bgColor} ${step.borderColor} border-2 ${step.color}`
                          : "bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:bg-gray-700/50 hover:text-gray-400"
                    }`}
                  >
                    {step.id < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ml-4 transition-colors duration-300 ${
                        step.id < currentStep ? "bg-orange-500" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`text-sm font-medium block ${step.id <= currentStep ? "text-white" : "text-gray-500"}`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block mt-1">{step.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <progress className="progress progress-warning w-full h-2" value={progress} max="100"></progress>
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div
              className={`card bg-gray-800/30 backdrop-blur-xl border border-gray-700/30 shadow-2xl ${isSubmitted ? "opacity-75 pointer-events-none" : ""}`}
            >
              <div className="card-body p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${currentStepData.bgColor} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <currentStepData.icon className={`w-5 h-5 ${currentStepData.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentStepData.title}</h2>
                      <p className="text-gray-400 text-sm">{currentStepData.description}</p>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[500px]"
                  >
                    <CurrentStepComponent form={form} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitted}
              className="btn btn-outline border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-orange-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitted}
                  className="btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      Creating...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Created Successfully!
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Create Problem
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </form>

        {/* Preview Modal */}
        {showPreview && <ProblemPreview problemData={form.getValues()} onClose={() => setShowPreview(false)} />}
      </div>
    </div>
  )
}
