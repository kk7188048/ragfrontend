import { useEffect, useCallback } from 'react';
import { debounce, throttle } from '../utils/helpers';

export const usePerformance = () => {
  // Measure performance
  const measurePerformance = useCallback((name, fn) => {
    return async (...args) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }, []);

  // Memory usage tracking
  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      });
    }
  }, []);

  // Debounced and throttled helpers
  const createDebouncedCallback = useCallback((callback, delay = 300) => {
    return debounce(callback, delay);
  }, []);

  const createThrottledCallback = useCallback((callback, limit = 100) => {
    return throttle(callback, limit);
  }, []);

  return {
    measurePerformance,
    trackMemoryUsage,
    createDebouncedCallback,
    createThrottledCallback,
  };
};

// Hook for optimizing re-renders
export const useRenderOptimization = (componentName) => {
  useEffect(() => {
    console.log(`${componentName} rendered at ${new Date().toLocaleTimeString()}`);
  });

  const logRerender = useCallback((reason) => {
    console.log(`${componentName} re-rendered: ${reason}`);
  }, [componentName]);

  return { logRerender };
};
