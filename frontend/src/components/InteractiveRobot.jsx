"use client"

import { useState, useEffect } from "react"
import RobotSpeechBubble from "./RobotSpeechBubble"

const InteractiveRobot = ({ currentField, hasErrors, onRobotInteraction }) => {
  const [robotState, setRobotState] = useState({
    isBlinking: false,
    eyeDirection: "center",
    isThinking: false,
    isWaving: false,
    screenText: 0,
    currentMessage: "",
    showSpeech: false,
    mood: "happy",
  })

  // Robot messages based on current field
  const messages = {
    welcome: "Hi there! Ready to join our coding community? 🚀",
    firstName: "Great! What should I call you?",
    lastName: "Nice to meet you! Last name too?",
    username: "Pick a cool username! Make it unique! 💻",
    email: "I'll need your email for important updates!",
    password: "Create a strong password to keep your account safe! 🔒",
    complete: "Awesome! You're all set! Welcome aboard! 🎉",
    error: "Oops! Let me help you fix that! 🤖",
  }

  const screenTexts = [
    [
      { text: "Hello!", color: "text-green-400" },
      { text: "Friend", color: "text-cyan-400" },
      { text: "👋", color: "text-yellow-400" },
    ],
    [
      { text: "Let's", color: "text-purple-400" },
      { text: "Code", color: "text-green-400" },
      { text: "Together!", color: "text-cyan-400" },
    ],
    [
      { text: "Join", color: "text-red-400" },
      { text: "Our", color: "text-blue-400" },
      { text: "Team!", color: "text-green-400" },
    ],
    [
      { text: "Ready?", color: "text-yellow-400" },
      { text: "Set?", color: "text-orange-400" },
      { text: "Go! 🚀", color: "text-green-400" },
    ],
  ]

  // Basic robot animations
  useEffect(() => {
    const intervals = []

    // Blinking animation
    const blinkInterval = setInterval(
      () => {
        setRobotState((prev) => ({ ...prev, isBlinking: true }))
        setTimeout(() => {
          setRobotState((prev) => ({ ...prev, isBlinking: false }))
        }, 150)
      },
      3000 + Math.random() * 2000,
    )

    // Eye movement
    const eyeMovementInterval = setInterval(() => {
      const directions = ["center", "left", "right"]
      const randomDirection = directions[Math.floor(Math.random() * directions.length)]
      setRobotState((prev) => ({ ...prev, eyeDirection: randomDirection }))

      setTimeout(() => {
        setRobotState((prev) => ({ ...prev, eyeDirection: "center" }))
      }, 1000)
    }, 4000)

    // Screen text cycling
    const screenTextInterval = setInterval(() => {
      setRobotState((prev) => ({ ...prev, screenText: (prev.screenText + 1) % 4 }))
    }, 3000)

    intervals.push(blinkInterval, eyeMovementInterval, screenTextInterval)

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [])

  // React to field changes
  useEffect(() => {
    let message = ""
    let mood = "happy"
    let showSpeech = false

    if (hasErrors) {
      message = messages.error
      mood = "thinking"
      showSpeech = true
      setRobotState((prev) => ({ ...prev, isThinking: true }))
      setTimeout(() => {
        setRobotState((prev) => ({ ...prev, isThinking: false }))
      }, 2000)
    } else if (messages[currentField]) {
      message = messages[currentField]
      showSpeech = true

      if (currentField === "welcome") {
        setRobotState((prev) => ({ ...prev, isWaving: true }))
        setTimeout(() => {
          setRobotState((prev) => ({ ...prev, isWaving: false }))
        }, 2000)
      }
    }

    setRobotState((prev) => ({
      ...prev,
      currentMessage: message,
      showSpeech,
      mood,
    }))

    if (showSpeech) {
      setTimeout(() => {
        setRobotState((prev) => ({ ...prev, showSpeech: false }))
      }, 4000)
    }
  }, [currentField, hasErrors])

  const getEyePosition = (direction) => {
    switch (direction) {
      case "left":
        return "translate-x-[-3px]"
      case "right":
        return "translate-x-[3px]"
      default:
        return "translate-x-0"
    }
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case "thinking":
        return "from-purple-500/20 via-blue-500/20 to-purple-500/20"
      case "celebrating":
        return "from-pink-500/20 via-yellow-500/20 to-green-500/20"
      default:
        return "from-cyan-500/20 via-purple-500/20 to-yellow-500/20"
    }
  }

  return (
    <div className="relative">
      {/* Speech Bubble */}
      <RobotSpeechBubble message={robotState.currentMessage} isVisible={robotState.showSpeech} position="top" />

      {/* Robot Container */}
      <div className="relative transform hover:scale-105 transition-transform duration-500 cursor-pointer">
        {/* Robot Base/Platform */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 sm:w-48 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full shadow-2xl border-2 border-slate-500">
          <div className="absolute inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"></div>
        </div>

        {/* Main Robot Body */}
        <div className="relative w-36 sm:w-44 lg:w-52 h-44 sm:h-52 lg:h-60 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-3xl shadow-2xl border-4 border-slate-600 overflow-hidden group">
          {/* Body Panels */}
          <div className="absolute inset-3 bg-gradient-to-b from-white to-slate-100 rounded-2xl border-2 border-slate-400">
            {/* Interactive Chest Panel */}
            <div
              className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-16 sm:h-20 bg-slate-900 rounded-xl border-3 border-slate-700 shadow-inner cursor-pointer hover:border-cyan-500 transition-colors duration-300"
              onClick={() => onRobotInteraction && onRobotInteraction("screen")}
            >
              {/* Animated Screen Display */}
              <div className="absolute inset-2 bg-black rounded-lg border border-slate-800 flex flex-col justify-center items-center overflow-hidden">
                <div className="text-xs font-mono text-center leading-tight transition-all duration-500">
                  {screenTexts[robotState.screenText].map((item, index) => (
                    <div
                      key={index}
                      className={`${item.color} transition-all duration-300 ${robotState.isThinking ? "animate-pulse" : ""}`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
                {robotState.isThinking && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <button
                className={`w-4 h-4 rounded-full shadow-lg border-2 transition-all duration-300 hover:scale-110 ${
                  robotState.mood === "thinking"
                    ? "bg-purple-500 border-purple-600 animate-pulse"
                    : "bg-red-500 border-red-600 hover:bg-red-400"
                }`}
                onClick={() => onRobotInteraction && onRobotInteraction("button1")}
              ></button>
              <button
                className="w-4 h-4 rounded-full shadow-lg border-2 transition-all duration-300 hover:scale-110 bg-yellow-500 border-yellow-600 hover:bg-yellow-400"
                onClick={() => onRobotInteraction && onRobotInteraction("button2")}
              ></button>
              <button
                className="w-4 h-4 rounded-full shadow-lg border-2 transition-all duration-300 hover:scale-110 bg-green-500 border-green-600 hover:bg-green-400"
                onClick={() => onRobotInteraction && onRobotInteraction("button3")}
              ></button>
            </div>
          </div>

          {/* Mood-based Glow Effect */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-500 bg-gradient-to-r ${getMoodColor(robotState.mood)}`}
          ></div>
        </div>

        {/* Interactive Robot Head */}
        <div
          className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2 transition-transform duration-500 cursor-pointer hover:scale-105"
          onClick={() => onRobotInteraction && onRobotInteraction("head")}
        >
          <div className="relative w-28 sm:w-32 lg:w-36 h-24 sm:h-28 lg:h-32 bg-gradient-to-b from-white to-slate-200 rounded-t-3xl rounded-b-xl shadow-2xl border-4 border-slate-600">
            {/* Head Panel */}
            <div className="absolute inset-3 bg-gradient-to-b from-slate-50 to-slate-100 rounded-t-2xl rounded-b-lg border-2 border-slate-400">
              {/* Interactive Eyes */}
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-5 sm:w-6 h-5 sm:h-6 bg-slate-800 rounded-full border-2 border-slate-700 shadow-inner overflow-hidden">
                {robotState.isBlinking ? (
                  <div className="w-full h-1 bg-slate-600 absolute top-1/2 transform -translate-y-1/2"></div>
                ) : (
                  <div
                    className={`absolute inset-1 bg-cyan-400 rounded-full shadow-lg transition-transform duration-300 ${getEyePosition(robotState.eyeDirection)}`}
                  >
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {robotState.isThinking && (
                      <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-5 sm:w-6 h-5 sm:h-6 bg-slate-800 rounded-full border-2 border-slate-700 shadow-inner overflow-hidden">
                {robotState.isBlinking ? (
                  <div className="w-full h-1 bg-slate-600 absolute top-1/2 transform -translate-y-1/2"></div>
                ) : (
                  <div
                    className={`absolute inset-1 bg-cyan-400 rounded-full shadow-lg transition-transform duration-300 ${getEyePosition(robotState.eyeDirection)}`}
                  >
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {robotState.isThinking && (
                      <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Mouth */}
              <div
                className={`absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 h-3 sm:h-4 bg-slate-800 rounded-full border-2 border-slate-600 transition-all duration-300 cursor-pointer hover:border-green-400 ${
                  robotState.isWaving ? "scale-110 border-green-400" : ""
                }`}
                onClick={() => onRobotInteraction && onRobotInteraction("mouth")}
              >
                <div className="absolute inset-0 flex justify-center items-center space-x-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-0.5 h-2 rounded transition-all duration-200 ${
                        robotState.isWaving ? "bg-green-400 animate-pulse" : "bg-slate-600"
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-10 h-2 rounded shadow-lg transition-all duration-500 ${
                  robotState.isThinking ? "bg-purple-400 animate-pulse" : "bg-cyan-400"
                }`}
              ></div>
            </div>

            {/* Interactive Antenna */}
            <div
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-yellow-500 rounded-full shadow-lg cursor-pointer hover:bg-yellow-400 transition-colors duration-300"
              onClick={() => onRobotInteraction && onRobotInteraction("antenna")}
            >
              <div
                className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full shadow-lg transition-all duration-300 ${
                  robotState.isThinking ? "bg-purple-400 animate-ping" : "bg-yellow-400 animate-pulse"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Interactive Robot Arms */}
        <div
          className={`absolute top-12 sm:top-16 -left-8 sm:-left-10 w-18 sm:w-22 h-5 sm:h-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full shadow-lg border-3 border-slate-600 transition-all duration-500 cursor-pointer hover:scale-105 ${
            robotState.isWaving ? "animate-bounce -rotate-45" : "rotate-12"
          }`}
          onClick={() => onRobotInteraction && onRobotInteraction("leftArm")}
        >
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-600 rounded-full border border-slate-700"></div>
          <div
            className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-5 h-4 bg-slate-200 rounded border-2 border-slate-600 transition-all duration-300 ${
              robotState.isWaving ? "bg-yellow-200 scale-110" : ""
            }`}
          >
            <div className="absolute inset-1 bg-slate-100 rounded"></div>
          </div>
        </div>

        <div
          className={`absolute top-12 sm:top-16 -right-8 sm:-right-10 w-18 sm:w-22 h-5 sm:h-6 bg-gradient-to-l from-slate-100 to-slate-200 rounded-full shadow-lg border-3 border-slate-600 transition-all duration-500 cursor-pointer hover:scale-105 ${
            robotState.isWaving ? "animate-bounce rotate-45" : "-rotate-12"
          }`}
          onClick={() => onRobotInteraction && onRobotInteraction("rightArm")}
        >
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-600 rounded-full border border-slate-700"></div>
          <div
            className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-5 h-4 bg-slate-200 rounded border-2 border-slate-600 transition-all duration-300 ${
              robotState.isWaving ? "bg-yellow-200 scale-110" : ""
            }`}
          >
            <div className="absolute inset-1 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveRobot
