"use client"

import { useState, useEffect } from "react"
import AnimatedBackground from "../components/AnimatedBackground"
import InteractiveRobot from "../components/InteractiveRobot"
import SignupForm from "../components/SignupForm"
const SignUpPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentField, setCurrentField] = useState("welcome")
  const [hasErrors, setHasErrors] = useState(false)
 

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Initialize robot with welcome message
  useEffect(() => {
    setTimeout(() => {
      setCurrentField("welcome")
    }, 1000)
  }, [])

  const handleFieldFocus = (fieldName) => {
    setCurrentField(fieldName)
    setHasErrors(false) // Reset errors when focusing new field
  }

  const handleFormError = (hasError) => {
    setHasErrors(hasError)
  }

  const handleRobotInteraction = (interaction) => {
    console.log("Robot interaction:", interaction)

    // Robot responses to interactions
    const responses = {
      screen: "Thanks for clicking my screen! I'm here to help! 🤖",
      head: "Hey! That tickles! 😄",
      mouth: "Beep boop! I love talking to new friends! 🗣️",
      antenna: "My antenna helps me think better! 📡",
      leftArm: "High five! 🙌",
      rightArm: "Let's code together! 💻",
      button1: "System status: All good! ✅",
      button2: "Motivation level: Maximum! 🚀",
      button3: "Friendship mode: Activated! 💫",
    }

    if (responses[interaction]) {
      console.log("Robot says:", responses[interaction])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground mousePosition={mousePosition} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Column - Form */}
        <div
          className={`flex-1 flex items-center justify-center p-4 sm:p-8 transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <SignupForm onFieldFocus={handleFieldFocus} onFormError={handleFormError} />
        </div>

        {/* Right Column - Interactive Robot */}
        <div
          className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-all duration-1000 delay-300 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          {/* Code Background */}
          <div className="absolute inset-0 opacity-5 lg:opacity-10">
            <pre className="text-white text-xs leading-relaxed p-4 sm:p-8 font-mono overflow-hidden">
              {`function welcomeNewCoder(user) {
  console.log(\`Welcome \${user.name}!\`);
  
  const skills = [];
  const journey = {
    start: 'today',
    goal: 'master coder',
    progress: 0
  };
  
  while (journey.progress < 100) {
    learnNewSkill();
    solveProblem();
    journey.progress++;
  }
  
  return 'Coding Master Achieved! 🎉';
}

class CodingJourney {
  constructor(user) {
    this.user = user;
    this.level = 'beginner';
    this.achievements = [];
  }
  
  startLearning() {
    return 'Let\\'s code together! 🚀';
  }
}`}
            </pre>
          </div>

          {/* Interactive Robot */}
          <div className="relative z-10 mb-8">
            <InteractiveRobot
              currentField={currentField}
              hasErrors={hasErrors}
              onRobotInteraction={handleRobotInteraction}
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center px-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-4 leading-tight">
              Meet CodeBot, Your AI Companion
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-md mx-auto leading-relaxed mb-6">
              I'm here to guide you through your coding journey. Click on me to interact and let's get started together!
            </p>

            {/* Interactive Features */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="text-cyan-400 text-sm font-medium">🤖 Interactive</div>
                <div className="text-slate-400 text-xs">Click on my parts!</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="text-purple-400 text-sm font-medium">💬 Helpful</div>
                <div className="text-slate-400 text-xs">I'll guide you!</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="text-yellow-400 text-sm font-medium">🎯 Smart</div>
                <div className="text-slate-400 text-xs">AI-powered hints</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <div className="text-green-400 text-sm font-medium">🚀 Fun</div>
                <div className="text-slate-400 text-xs">Learning together!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
