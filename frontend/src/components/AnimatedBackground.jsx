import { Binary, Braces, Hash, Code } from 'lucide-react'

const AnimatedBackground = ({ mousePosition }) => {
  return (
    <>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-cyan-500/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Large Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Mouse Follower Effect */}
        <div
          className="absolute w-96 h-96 rounded-full blur-2xl pointer-events-none transition-all duration-300 ease-out opacity-20"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Binary
          className="absolute top-10 left-10 w-6 h-6 text-cyan-400/30 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <Braces
          className="absolute top-20 right-20 w-8 h-8 text-purple-400/30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <Hash
          className="absolute bottom-20 left-20 w-5 h-5 text-yellow-400/30 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <Code
          className="absolute bottom-10 right-10 w-7 h-7 text-green-400/30 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
      </div>
    </>
  )
}

export default AnimatedBackground
