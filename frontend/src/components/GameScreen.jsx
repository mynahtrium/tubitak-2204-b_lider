import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameLoop from "../engine/core/GameLoop";
import ColorHop from "../minigames/ColorHop";
import { errorLogger } from "../utils/errorLogger";
import LoadingScreen from "./LoadingScreen";


const GAME_NAMES = {
  colorhop: "Color Hop",
  math: "Math Challenge",
  language: "Word Master",
};


export default function GameScreen({ gameId, onExit }) {
  const [currentTask, setCurrentTask] = useState(null);
  const [result, setResult] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState({ level: 1, xp: 0 });
  const [backgroundColor, setBackgroundColor] = useState(null);
  const loop = useRef(null);
  const gameContainerRef = useRef(null);


  // Fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };


    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);


  const enterFullscreen = async () => {
    const element = gameContainerRef.current || document.documentElement;
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (err) {
      errorLogger.log(err, {
        context: { component: "GameScreen", action: "enter_fullscreen" },
      });
    }
  };


  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      errorLogger.log(err, {
        context: { component: "GameScreen", action: "exit_fullscreen" },
      });
    }
  };


  // Initialize GameLoop after loading
  useEffect(() => {
    if (!isLoading && gameId) {
      try {
        loop.current = new GameLoop(
          (task) => {
            try {
              setCurrentTask(task);
            } catch (error) {
              errorLogger.log(error, {
                context: { component: "GameScreen", action: "set_task" },
              });
            }
          },
          (result) => {
            try {
              setResult(result);
              // Update player stats
              setPlayerStats({
                level: result.level,
                xp: result.xp,
              });
              // Reset background color after showing result
              if (result.correct) {
                setTimeout(() => {
                  setBackgroundColor(null);
                }, 800);
              }
            } catch (error) {
              errorLogger.log(error, {
                context: { component: "GameScreen", action: "set_result" },
              });
            }
          },
          gameId // Pass gameId to filter tasks
        );
        loop.current.start();
      } catch (error) {
        errorLogger.log(error, {
          context: { component: "GameScreen", action: "gameloop_init" },
        });
      }
    }

    return () => {
      loop.current = null;
    };
  }, [isLoading, gameId]);


  function submit(correct) {
    try {
      if (loop.current) {
        loop.current.submitAnswer(correct);
      }
    } catch (error) {
      errorLogger.log(error, {
        context: { component: "GameScreen", action: "submit_answer", correct },
      });
    }
  }


  function renderTask(task, submit) {
    if (task.type === "colorhop") {
      return <ColorHop task={task} submit={submit} onCorrectAnswer={(color) => setBackgroundColor(color)} />;
    }


    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-400">Task type not found</p>
      </div>
    );
  }


  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [result]);


  const handleLoadingComplete = () => {
    setIsLoading(false);
  };


  if (isLoading) {
    return (
      <LoadingScreen
        gameName={GAME_NAMES[gameId] || "Oyun"}
        onComplete={handleLoadingComplete}
      />
    );
  }


  return (
    <div
      ref={gameContainerRef}
      className="w-full h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>


      {/* Player Stats */}
      <div className="absolute top-4 left-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-indigo-500/30"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Level</p>
              <p className="text-2xl font-bold text-indigo-400">{playerStats.level}</p>
            </div>
            <div className="w-24">
              <p className="text-xs text-gray-400 mb-1">XP</p>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(playerStats.xp % (playerStats.level * 100)) / (playerStats.level * 100) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-300 mt-1">{playerStats.xp} XP</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isFullscreen ? exitFullscreen : enterFullscreen}
          className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg backdrop-blur-sm text-white font-semibold shadow-lg transition-colors"
        >
          {isFullscreen ? "⤓ Çık" : "⤢ Tam Ekran"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg backdrop-blur-sm text-white font-semibold shadow-lg transition-colors"
        >
          ✕ Çıkış
        </motion.button>
      </div>


      {/* Game container - full screen */}
      <AnimatePresence mode="wait">
        {currentTask && (
          <motion.div
            key={currentTask.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="w-full h-full flex items-center justify-center p-8"
          >
            <div 
              className="w-full max-w-4xl h-full max-h-[800px] backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-500/20 p-8 flex items-center justify-center transition-colors duration-500"
              style={{
                background: backgroundColor 
                  ? `linear-gradient(to bottom right, ${backgroundColor}90, ${backgroundColor}70)`
                  : "linear-gradient(to bottom right, rgb(31 41 55 / 0.9), rgb(17 24 39 / 0.9))"
              }}
            >
              {renderTask(currentTask, submit)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Result notification */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`fixed top-20 right-4 p-6 rounded-xl shadow-2xl backdrop-blur-md border-2 z-50 ${
              result.correct
                ? "bg-gradient-to-br from-green-600/90 to-emerald-600/90 border-green-400"
                : "bg-gradient-to-br from-red-600/90 to-rose-600/90 border-red-400"
            }`}
          >
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.1, type: "spring" }}
              className="font-bold text-2xl mb-2"
            >
              {result.correct ? "✓ Doğru!" : "✗ Yanlış!"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-white/90"
            >
              XP: {result.xp} | Level: {result.level}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
