"use client"

import { Github, Chrome } from "lucide-react"
import { motion } from "framer-motion"

export function SocialLogin() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="divider">Or continue with</div>

      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 1.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            show: { opacity: 1, x: 0 },
          }}
        >
          <motion.button
            className="btn btn-outline w-full group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="flex items-center" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </motion.div>
          </motion.button>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 20 },
            show: { opacity: 1, x: 0 },
          }}
        >
          <motion.button
            className="btn btn-outline w-full group"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="flex items-center" whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
