"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, Lock, Terminal, Zap, ArrowRight, Chrome, Github } from "lucide-react"
import FormInput from "./FormInput"
import { signupSchema } from "../Schema/auth.schema"
import { useAuthStore } from "../Store/useAuthStore"
import { Loader2 } from "lucide-react"
// Zod schema for form validation

const SignupForm = ({ onFieldFocus, onFormError }) => {
  const [showPassword, setShowPassword] = useState(false)
  const {isSigninUp,signup} = useAuthStore()
  const {
    register,
    handleSubmit,   
    formState: { errors},
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })


  const onSubmit = async (data) => {
    try {
      console.log("Form submitted with data:", data)
      // Simulate API call
      await signup(data)
      onFieldFocus("complete")
    } catch (error) {
      console.error("Submission error:", error)
      onFormError(true)
    }
  }

  const handleFieldFocus = (fieldName) => {
    onFieldFocus(fieldName)
  }

  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0
  if (hasErrors && onFormError) {
    onFormError(true)
  }

  return (
    <div className="w-full max-w-md">
      <div className="card bg-slate-800/95 backdrop-blur-xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Card Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-yellow-500/10 rounded-2xl blur-xl"></div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 p-[1px] animate-pulse">
          <div className="h-full w-full rounded-2xl bg-slate-800/95 backdrop-blur-xl"></div>
        </div>

        <div className="card-body relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl transform hover:scale-110 transition-transform duration-300">
                <Terminal className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Join LeetLab
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">Let's get you started on your coding journey!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                icon={User}
                type="text"
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                focusColor="cyan"
                {...register("firstName")}
                onFocus={() => handleFieldFocus("firstName")}
              />
              <FormInput
                icon={User}
                type="text"
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                focusColor="cyan"
                {...register("lastName")}
                onFocus={() => handleFieldFocus("lastName")}
              />
            </div>

            <FormInput
              icon={Terminal}
              type="text"
              label="Username"
              placeholder="coder123"
              error={errors.username?.message}
              focusColor="purple"
              {...register("username")}
              onFocus={() => handleFieldFocus("username")}
            />

            <FormInput
              icon={Mail}
              type="email"
              label="Email"
              placeholder="john@example.com"
              error={errors.email?.message}
              focusColor="yellow"
              {...register("email")}
              onFocus={() => handleFieldFocus("email")}
            />

            <FormInput
              icon={Lock}
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              focusColor="green"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              {...register("password")}
              onFocus={() => handleFieldFocus("password")}
            />

            {/* Submit Button */}
            <button
                  type="submit"
                  disabled={isSigninUp}
                 className="btn w-full bg-gradient-to-r from-cyan-500 to-purple-500 border-none text-white hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
         >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  
       {isSigninUp ? (
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  ) : (
    <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
  )}

  {isSigninUp ? "Creating Account..." : "Create Account"}

  <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${!isSigninUp && "group-hover:translate-x-1"}`} />
</button>

            {/* Divider */}
            <div className="divider text-slate-500 relative">
              <span className="bg-slate-800 px-4">or continue with</span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="btn btn-outline border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:scale-105 transition-all duration-300 group"
              >
                <Chrome className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Google
              </button>
              <button
                type="button"
                className="btn btn-outline border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:scale-105 transition-all duration-300 group"
              >
                <Github className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                GitHub
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-slate-400 text-sm">Already have an account? </span>
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-all duration-300"
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
