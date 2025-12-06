import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { errorLogger } from "../utils/errorLogger";


const COLORS = [
  { name: "kırmızı", value: "#ff0000" },
  { name: "mavi", value: "#0000ff" },
  { name: "yeşil", value: "#00ff00" },
  { name: "sarı", value: "#ffff00" },
  { name: "mor", value: "#800080" },
  { name: "turuncu", value: "#ffa500" },
  { name: "pembe", value: "#ffc0cb" },
  { name: "turkuaz", value: "#00ffff" },
  { name: "lacivert", value: "#000080" },
  { name: "kahverengi", value: "#8b4513" },
  { name: "siyah", value: "#000000" },
  { name: "beyaz", value: "#ffffff" },
  { name: "gri", value: "#808080" },
  { name: "altın", value: "#d4af37" },
  { name: "gümüş", value: "#c0c0c0" },
];


export default function ColorHop({ task, submit, onCorrectAnswer }) {
  const [targetColor, setTargetColor] = useState(null);
  const [ballY, setBallY] = useState(-150);
  const [disabled, setDisabled] = useState(false);
  const [ballVisible, setBallVisible] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);


  useEffect(() => {
    try {
      // Reset state first - ensure ball is visible for new task
      setDisabled(false);
      setBallY(-150);
      setShowAnswer(false);
      // Only set visible if ball was hidden (from previous wrong answer)
      // This prevents flickering if ball was already visible
      setBallVisible((prev) => {
        // If ball was hidden, make it visible for new task
        // If ball was already visible, keep it visible
        return true;
      });
      
      // Small delay to ensure smooth transition
      setTimeout(() => {
        // Rastgele renk seç
        const pick = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetColor(pick);
      }, 100);
    } catch (error) {
      errorLogger.log(error, {
        context: { component: "ColorHop", action: "init_task" },
      });
    }
  }, [task?.id]);


  const displayColors = useMemo(() => {
    if (!targetColor) return [];
    // Target color'ı içeren 5 renk seç (target + 4 random)
    const otherColors = COLORS.filter(c => c.value !== targetColor.value);
    const shuffled = [...otherColors].sort(() => Math.random() - 0.5);
    const colors = [targetColor, ...shuffled.slice(0, 4)];
    return colors.sort(() => Math.random() - 0.5);
  }, [targetColor]);


  function choose(selectedColor) {
    try {
      if (disabled) return;
      setDisabled(true);


      const correct = selectedColor.value === targetColor.value;


      // Show the answer (colorful ball without question mark)
      setShowAnswer(true);
      
      // top animasyonu
      if (correct) {
        setBallY(80); // zıplama
        // Change background color on correct answer
        if (onCorrectAnswer) {
          onCorrectAnswer(targetColor.value);
        }
        // After jump, submit and reset
        setTimeout(() => {
          try {
            submit(correct);
          } catch (error) {
            errorLogger.log(error, {
              context: { component: "ColorHop", action: "submit", color, correct },
            });
          }
        }, 400);
      } else {
        // Wrong answer - ball moves up and fades out
        setBallY(-200); // yukarı çıkma
        // Fade out while moving up - hide after animation completes
        setTimeout(() => {
          setBallVisible(false);
          // Also reset ballY to ensure it doesn't show at wrong position
          setBallY(-150);
        }, 600); // Match animation duration
        // Submit after animation completes
        setTimeout(() => {
          try {
            submit(correct);
            // Ensure ball stays hidden and reset
            setBallVisible(false);
            setBallY(-150);
          } catch (error) {
            errorLogger.log(error, {
              context: { component: "ColorHop", action: "submit", color, correct },
            });
          }
        }, 800);
      }
    } catch (error) {
      errorLogger.log(error, {
        context: { component: "ColorHop", action: "choose", color },
      });
    }
  }


  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none">


      {targetColor && (
        <>
          {/* Görev metni */}
          <motion.h1
            key={targetColor.value}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-4xl font-bold mb-6 text-white"
          >
            Hangi renk {targetColor.name}?
          </motion.h1>


          {/* Top with enhanced animation */}
          {ballVisible && (
            <motion.div
              animate={{
                y: ballY,
                rotate: ballY > 0 ? 360 : ballY < -150 ? 720 : 0,
                scale: ballY === 80 ? [1, 1.2, 1] : ballY < -150 ? [1, 0.8, 0] : 1,
                opacity: ballY < -150 ? [1, 0.3, 0] : 1,
              }}
              transition={{
                y: { 
                  type: ballY < -150 ? "tween" : "spring", 
                  stiffness: ballY < -150 ? 0 : 200, 
                  damping: ballY < -150 ? 0 : 15,
                  duration: ballY < -150 ? 0.6 : undefined,
                },
                rotate: { duration: 0.6 },
                scale: { duration: ballY < -150 ? 0.6 : 0.3 },
                opacity: { duration: ballY < -150 ? 0.6 : 0 },
              }}
            className="w-20 h-20 rounded-full shadow-2xl relative flex items-center justify-center"
            style={{ 
              backgroundColor: showAnswer ? targetColor.value : "#6b7280" 
            }}
            >
              {!showAnswer && (
                <span className="text-4xl font-bold text-white">?</span>
              )}
              {/* Glow effect - only show when not disappearing */}
              {ballY >= -150 && (
                <motion.div
                  className="absolute inset-0 rounded-full blur-xl opacity-50"
                  style={{ 
                    backgroundColor: showAnswer ? targetColor.value : "#9ca3af" 
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          )}
        </>
      )}


      {/* Platformlar */}
      <div className="flex gap-6 mt-8">
        {displayColors.map((color, index) => (
          <motion.div
            key={color.value}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            whileHover={
              disabled
                ? {}
                : {
                    scale: 1.15,
                    y: -5,
                    boxShadow: `0 10px 30px ${color.value}80`,
                  }
            }
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`w-32 h-16 rounded-2xl shadow-2xl relative overflow-hidden ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => choose(color)}
            style={{ backgroundColor: color.value }}
          >
            {/* Shine effect on hover */}
            {!disabled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                whileHover={{ opacity: 0.3, x: ["-100%", "200%"] }}
                transition={{ duration: 0.6 }}
              />
            )}
            {/* Border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2"
              style={{ borderColor: color.value }}
              animate={{
                boxShadow: disabled
                  ? "none"
                  : [
                      `0 0 0px ${color.value}`,
                      `0 0 20px ${color.value}80`,
                      `0 0 0px ${color.value}`,
                    ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

