import { useCallback } from "react";
import { errorLogger } from "../utils/errorLogger";


export function useErrorHandler(componentName = "Unknown") {
  const handleError = useCallback(
    (error, context = {}) => {
      errorLogger.log(error, {
        context: {
          component: componentName,
          ...context,
        },
      });
    },
    [componentName]
  );

  const wrapAsync = useCallback(
    (asyncFn) => {
      return async (...args) => {
        try {
          return await asyncFn(...args);
        } catch (error) {
          handleError(error, { action: asyncFn.name || "async_function" });
          throw error;
        }
      };
    },
    [handleError]
  );

  return { handleError, wrapAsync };
}

