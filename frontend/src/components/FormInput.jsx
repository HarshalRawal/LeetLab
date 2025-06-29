"use client"

import { forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"

const FormInput = forwardRef(
  (
    {
      icon: Icon,
      type = "text",
      placeholder,
      label,
      error,
      showPassword,
      onTogglePassword,
      focusColor = "cyan",
      onFocus,
      ...props
    },
    ref,
  ) => {
    const colorClasses = {
      cyan: {
        border: "focus:border-cyan-400 focus:ring-cyan-400/20",
        icon: "group-hover:text-cyan-400",
        gradient: "group-hover:from-cyan-500/5",
      },
      purple: {
        border: "focus:border-purple-400 focus:ring-purple-400/20",
        icon: "group-hover:text-purple-400",
        gradient: "group-hover:from-purple-500/5",
      },
      yellow: {
        border: "focus:border-yellow-400 focus:ring-yellow-400/20",
        icon: "group-hover:text-yellow-400",
        gradient: "group-hover:from-yellow-500/5",
      },
      green: {
        border: "focus:border-green-400 focus:ring-green-400/20",
        icon: "group-hover:text-green-400",
        gradient: "group-hover:from-green-500/5",
      },
    }

    const colors = colorClasses[focusColor]

    // Check if this is a password field (either type="password" or has password toggle functionality)
    const isPasswordField = onTogglePassword !== undefined

    return (
      <div className="form-control group">
        <label className="label">
          <span className="label-text text-slate-300 text-sm font-medium">{label}</span>
          {error && <span className="label-text-alt text-red-400 text-xs">{error}</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            onFocus={onFocus}
            className={`input input-bordered w-full bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pl-10 ${
              isPasswordField ? "pr-10" : "pr-4"
            } transition-all duration-300 group-hover:border-slate-500 ${colors.border} ${
              error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "focus:ring-2"
            }`}
            {...props}
          />
          <Icon
            className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 transition-colors duration-300 ${colors.icon} ${
              error ? "text-red-400" : ""
            }`}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300 z-10"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          <div
            className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${focusColor}-500/0 to-${focusColor}-500/0 ${colors.gradient} group-hover:to-transparent transition-all duration-300 pointer-events-none`}
          ></div>
        </div>
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

export default FormInput
