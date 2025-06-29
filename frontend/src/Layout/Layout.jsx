"use client"
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import { motion } from "motion/react"

const Layout = () => {
  return (
    <motion.div
      className="min-h-screen bg-gray-900/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </motion.div>
  )
}

export default Layout
