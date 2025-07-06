import { LoginHeader } from "../components/loginPage/login-header.jsx"
import { LoginForm } from "../components/loginPage/login-form.jsx"
import { SocialLogin } from "../components/loginPage/social-login.jsx"
import { CodingBackground } from "../components/loginPage/coding-background.jsx"
import { motion } from "motion/react"
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-300 flex items-center justify-center p-4 relative overflow-hidden">
      <CodingBackground />

      {/* Main login container */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="card bg-base-100 shadow-2xl relative overflow-hidden"
          whileHover={{
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated border gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-success/20 rounded-2xl"
            animate={{
              background: [
                "linear-gradient(0deg, hsl(var(--p) / 0.2), hsl(var(--s) / 0.2), hsl(var(--su) / 0.2))",
                "linear-gradient(120deg, hsl(var(--p) / 0.2), hsl(var(--s) / 0.2), hsl(var(--su) / 0.2))",
                "linear-gradient(240deg, hsl(var(--p) / 0.2), hsl(var(--s) / 0.2), hsl(var(--su) / 0.2))",
                "linear-gradient(360deg, hsl(var(--p) / 0.2), hsl(var(--s) / 0.2), hsl(var(--su) / 0.2))",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          <div className="card-body relative z-10">
            <LoginHeader />

            <div className="mt-8 space-y-6">
              <LoginForm />
              <SocialLogin />
            </div>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <p className="text-base-content/50 text-xs">Secure login powered by modern encryption</p>
        </motion.div>
      </motion.div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-success/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Animated grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--p) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--p) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}
