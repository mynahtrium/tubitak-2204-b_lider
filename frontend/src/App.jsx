import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GameSelection from "./components/GameSelection";
import GameScreen from "./components/GameScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import DevErrorPanel from "./components/DevErrorPanel";


export default function App() {
  const [currentScreen, setCurrentScreen] = useState("selection");
  const [selectedGame, setSelectedGame] = useState(null);


  const handleSelectGame = (gameId) => {
    try {
      setSelectedGame(gameId);
      setCurrentScreen("game");
    } catch (error) {
      console.error("Error selecting game:", error);
    }
  };


  const handleExitGame = () => {
    try {
      setCurrentScreen("selection");
      setSelectedGame(null);
    } catch (error) {
      console.error("Error exiting game:", error);
    }
  };


  return (
    <ErrorBoundary>
      <div className="w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameSelection onSelectGame={handleSelectGame} />
            </motion.div>
          )}


          {currentScreen === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GameScreen gameId={selectedGame} onExit={handleExitGame} />
            </motion.div>
          )}
        </AnimatePresence>
        <DevErrorPanel />
      </div>
    </ErrorBoundary>
  );
}
