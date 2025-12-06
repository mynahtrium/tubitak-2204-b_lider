import { motion } from "framer-motion";
import { useState } from "react";


const GAMES = [
  {
    id: "colorhop",
    name: "Color Hop",
    description: "Renkleri eşleştir ve zıpla!",
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "math",
    name: "Math Challenge",
    description: "Matematik sorularını çöz!",
    icon: "🔢",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "language",
    name: "Word Master",
    description: "Kelime bulma oyunu!",
    icon: "📚",
    color: "from-green-500 to-emerald-500",
  },
];


export default function GameSelection({ onSelectGame }) {
  const [hoveredId, setHoveredId] = useState(null);


  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>


      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-12"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          DreamForge
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-300"
        >
          Oyun seç ve eğlenmeye başla!
        </motion.p>
      </motion.div>


      {/* Game cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-8 max-w-6xl w-full">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
            onHoverStart={() => setHoveredId(game.id)}
            onHoverEnd={() => setHoveredId(null)}
            className="relative"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectGame(game.id)}
              className={`w-full h-64 rounded-2xl bg-gradient-to-br ${game.color} p-6 shadow-2xl relative overflow-hidden group cursor-pointer`}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                animate={{
                  x: hoveredId === game.id ? ["-100%", "200%"] : "-100%",
                }}
                transition={{
                  duration: 1.5,
                  repeat: hoveredId === game.id ? Infinity : 0,
                  repeatDelay: 0.5,
                }}
              />


              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <motion.div
                  animate={{
                    rotate: hoveredId === game.id ? [0, 10, -10, 10, 0] : 0,
                    scale: hoveredId === game.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {game.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-white/80 text-sm">{game.description}</p>
              </div>


              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: hoveredId === game.id
                    ? "0 0 40px rgba(168, 85, 247, 0.6)"
                    : "0 0 20px rgba(168, 85, 247, 0.3)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        ))}
      </div>


      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-12 text-gray-400 text-sm"
      >
        <p>Bir oyun seç ve başla! 🚀</p>
      </motion.div>
    </div>
  );
}

