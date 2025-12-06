import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { errorLogger } from "../utils/errorLogger";


export default function DevErrorPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Load errors from localStorage on mount
    try {
      const saved = localStorage.getItem("dreamforge_errors");
      if (saved) {
        setErrors(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load errors from localStorage", e);
    }

    // Subscribe to new errors
    const unsubscribe = errorLogger.subscribe((error) => {
      if (error) {
        setErrors((prev) => [error, ...prev].slice(0, 100));
      }
    });

    return unsubscribe;
  }, []);

  const clearErrors = () => {
    errorLogger.clearErrors();
    setErrors([]);
  };

  const exportErrors = () => {
    const data = errorLogger.exportErrors();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dreamforge-errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (errors.length === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-xl"
        title="Hata Paneli"
      >
        {errors.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {errors.length > 9 ? "9+" : errors.length}
          </motion.span>
        )}
        🐛
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-[9998] w-96 max-h-[600px] bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-red-500/50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-red-600/80 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐛</span>
                <div>
                  <h3 className="font-bold text-white">Hata Takip Sistemi</h3>
                  <p className="text-xs text-red-100">
                    {errors.length} hata kaydedildi
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-red-700 rounded p-1"
                  title={isMinimized ? "Genişlet" : "Küçült"}
                >
                  {isMinimized ? "⬆" : "⬇"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-red-700 rounded p-1"
                  title="Kapat"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Actions */}
                <div className="p-3 bg-gray-800/50 flex gap-2 border-b border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearErrors}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-semibold flex-1"
                  >
                    Temizle
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportErrors}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm font-semibold flex-1"
                  >
                    Dışa Aktar
                  </motion.button>
                </div>

                {/* Error list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {errors.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-4xl mb-2">✅</p>
                      <p>Henüz hata yok!</p>
                    </div>
                  ) : (
                    errors.map((error) => (
                      <ErrorItem key={error.id} error={error} />
                    ))
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ErrorItem({ error }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyError = () => {
    const errorText = errorLogger.exportErrors();
    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s önce`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}d önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}s önce`;
    return `${Math.floor(hours / 24)}g önce`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800/50 rounded-lg p-3 border border-red-500/30 cursor-pointer hover:border-red-500/50 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-red-300 font-semibold text-sm truncate">
            {error.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {timeAgo(error.timestamp)}
          </p>
          {error.context?.type && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-700 text-xs rounded text-gray-300">
              {error.context.type}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyError();
          }}
          className="text-gray-400 hover:text-white p-1"
          title="Kopyala"
        >
          {copied ? "✓" : "📋"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-700"
          >
            <div className="space-y-2 text-xs">
              {error.stack && (
                <div>
                  <p className="text-gray-400 font-semibold mb-1">Stack:</p>
                  <pre className="bg-gray-900/50 p-2 rounded text-gray-300 font-mono overflow-auto max-h-32 whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </div>
              )}
              {error.componentStack && (
                <div>
                  <p className="text-gray-400 font-semibold mb-1">
                    Component Stack:
                  </p>
                  <pre className="bg-gray-900/50 p-2 rounded text-gray-300 font-mono overflow-auto max-h-32 whitespace-pre-wrap break-words">
                    {error.componentStack}
                  </pre>
                </div>
              )}
              <div className="text-gray-400">
                <p>
                  <strong>ID:</strong> {error.id}
                </p>
                <p>
                  <strong>Zaman:</strong> {new Date(error.timestamp).toLocaleString("tr-TR")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

