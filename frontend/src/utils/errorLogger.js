class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.listeners = [];
  }

  log(error, errorInfo = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error?.message || "Unknown error",
      stack: error?.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: errorInfo.errorBoundary,
      context: errorInfo.context || {},
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
    };

    this.errors.unshift(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Save to localStorage
    try {
      localStorage.setItem("dreamforge_errors", JSON.stringify(this.errors.slice(0, 50)));
    } catch (e) {
      console.warn("Could not save errors to localStorage", e);
    }

    // Console log
    console.error("🚨 DreamForge Error:", errorEntry);

    // Notify listeners
    this.listeners.forEach((listener) => listener(errorEntry));

    return errorEntry;
  }

  getErrors(limit = 10) {
    return this.errors.slice(0, limit);
  }

  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem("dreamforge_errors");
    } catch (e) {
      console.warn("Could not clear errors from localStorage", e);
    }
    this.listeners.forEach((listener) => listener(null));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  exportErrors() {
    return JSON.stringify(this.errors, null, 2);
  }
}

export const errorLogger = new ErrorLogger();

// Global error handlers
if (typeof window !== "undefined") {
  // Unhandled errors
  window.addEventListener("error", (event) => {
    errorLogger.log(event.error || new Error(event.message), {
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: "unhandled_error",
      },
    });
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.log(
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason)),
      {
        context: {
          type: "unhandled_promise_rejection",
          reason: event.reason,
        },
      }
    );
  });
}

