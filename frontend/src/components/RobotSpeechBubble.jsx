const RobotSpeechBubble = ({ message, isVisible, position = "top" }) => {
    if (!isVisible) return null
  
    const positionClasses = {
      top: "-top-16 left-1/2 transform -translate-x-1/2",
      left: "-left-48 top-1/2 transform -translate-y-1/2",
      right: "-right-48 top-1/2 transform -translate-y-1/2",
    }
  
    return (
      <div
        className={`absolute ${positionClasses[position]} z-50 animate-in fade-in slide-in-from-bottom-2 duration-300`}
      >
        <div className="bg-slate-800/95 backdrop-blur-sm border border-cyan-400/50 rounded-2xl px-4 py-2 shadow-2xl max-w-xs">
          <p className="text-cyan-300 text-sm font-medium">{message}</p>
          {/* Speech bubble tail */}
          <div
            className={`absolute w-3 h-3 bg-slate-800 border-r border-b border-cyan-400/50 transform rotate-45 ${
              position === "top"
                ? "bottom-[-6px] left-1/2 -translate-x-1/2"
                : position === "left"
                  ? "right-[-6px] top-1/2 -translate-y-1/2"
                  : "left-[-6px] top-1/2 -translate-y-1/2"
            }`}
          ></div>
        </div>
      </div>
    )
  }
  
  export default RobotSpeechBubble
  