import { motion } from "motion/react"

export function CodingBackground() {
  const codeSnippets = [
    { text: "function solve(arr) {", color: "text-success/30", position: "top-20 left-10", rotation: 12 },
    { text: "return arr.sort()", color: "text-primary/30", position: "top-40 right-20", rotation: -6 },
    { text: "O(n log n)", color: "text-secondary/30", position: "bottom-32 left-20", rotation: 6 },
    { text: "while (left < right)", color: "text-warning/30", position: "bottom-20 right-10", rotation: -12 },
    { text: "dp[i] = dp[i-1] + dp[i-2]", color: "text-info/30", position: "top-60 left-1/2", rotation: -3 },
  ]

  const shapes = [
    { size: "w-20 h-20", color: "border-primary/20", position: "top-10 right-10", shape: "rounded-lg", rotation: 45 },
    {
      size: "w-16 h-16",
      color: "border-success/20",
      position: "bottom-10 left-10",
      shape: "rounded-full",
      rotation: 0,
    },
    { size: "w-12 h-12", color: "border-secondary/20", position: "top-1/2 right-5", shape: "", rotation: 12 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated code snippets */}
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          className={`absolute ${snippet.position} ${snippet.color} font-mono text-sm animate-float`}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: snippet.rotation,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: snippet.rotation,
          }}
          transition={{
            duration: 2,
            delay: index * 0.3,
          }}
          style={{
            animationDelay: `${index * 0.5}s`,
          }}
        >
          {snippet.text}
        </motion.div>
      ))}

      {/* Animated geometric shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.position} ${shape.size} border ${shape.color} ${shape.shape}`}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: shape.rotation,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [shape.rotation, shape.rotation + 360],
          }}
          transition={{
            duration: 1,
            delay: index * 0.2,
            rotate: {
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.8}s`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: index * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
