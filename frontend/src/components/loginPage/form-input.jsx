import { forwardRef, useState } from "react"
import { motion, AnimatePresence } from  "motion/react"

export const FormInput = forwardRef(({ label, error, icon, className = "", ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className="form-control w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.label
        className="label"
        animate={{
          color: isFocused ? "hsl(var(--p))" : "hsl(var(--bc))",
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="label-text font-medium">{label}</span>
      </motion.label>
      <div className="relative">
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
            animate={{
              color: isFocused ? "hsl(var(--p))" : "hsl(var(--bc) / 0.5)",
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <motion.input
          ref={ref}
          className={`input input-bordered w-full ${icon ? "pl-10" : ""} ${
            error ? "input-error" : ""
          } bg-base-200/50 focus:bg-base-200 transition-all duration-300 ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{
            scale: 1.02,
            boxShadow: "0 0 0 3px hsl(var(--p) / 0.1)",
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-success rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0.5 }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.label
            className="label"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <span className="label-text-alt text-error flex items-center space-x-1">
              <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                ⚠
              </motion.span>
              <span>{error}</span>
            </span>
          </motion.label>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

FormInput.displayName = "FormInput"

