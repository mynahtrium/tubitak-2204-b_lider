import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { errorLogger } from "../utils/errorLogger";


class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const loggedError = errorLogger.log(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      context: {
        props: this.props,
        state: this.state,
      },
    });

    this.setState({
      error,
      errorInfo: {
        ...errorInfo,
        loggedId: loggedError.id,
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          fallback={this.props.fallback}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorDisplay({ error, errorInfo, onReset, fallback }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyError = () => {
    const errorText = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
Logged ID: ${errorInfo?.loggedId}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (fallback) {
    return fallback({ error, errorInfo, onReset });
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-red-900 via-gray-900 to-red-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-red-500/50"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="text-5xl"
          >
            ⚠️
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-300">
              Uygulama beklenmeyen bir hatayla karşılaştı
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-red-500/30">
          <p className="text-red-300 font-mono text-sm break-words">
            {error?.message || "Bilinmeyen hata"}
          </p>
        </div>

        <div className="flex gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
          >
            {showDetails ? "Detayları Gizle" : "Detayları Göster"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyError}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold"
          >
            {copied ? "✓ Kopyalandı!" : "📋 Kopyala"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
          >
            🔄 Yeniden Dene
          </motion.button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-2">Stack Trace:</h3>
                <pre className="text-xs text-gray-300 font-mono overflow-auto max-h-64 whitespace-pre-wrap break-words">
                  {error?.stack || "Stack trace yok"}
                </pre>
                {errorInfo?.componentStack && (
                  <>
                    <h3 className="text-red-400 font-semibold mb-2 mt-4">
                      Component Stack:
                    </h3>
                    <pre className="text-xs text-gray-300 font-mono overflow-auto max-h-64 whitespace-pre-wrap break-words">
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
                {errorInfo?.loggedId && (
                  <p className="text-xs text-gray-400 mt-4">
                    Hata ID: {errorInfo.loggedId}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ErrorBoundaryClass;

