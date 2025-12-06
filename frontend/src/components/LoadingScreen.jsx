import { motion } from "framer-motion";
import { useEffect, useState } from "react";


export default function LoadingScreen({ gameName = "Oyun", onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Yükleniyor...");

  const loadingMessages = [
    "Oyun hazırlanıyor...",
    "Görevler yükleniyor...",
    "Neredeyse hazır!",
    "Başlamak için hazır!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setLoadingText(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-30"
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        {/* Game name */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {gameName}
        </motion.h1>

        {/* Loading spinner */}
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto border-4 border-indigo-500/30 border-t-indigo-400 rounded-full"
          />
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto mb-4">
          <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.p
            key={progress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300 mt-2 text-sm"
          >
            {progress}%
          </motion.p>
        </div>

        {/* Loading text */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-gray-300"
        >
          {loadingText}
        </motion.p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-indigo-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

