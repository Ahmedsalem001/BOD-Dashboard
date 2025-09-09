import { useEffect, useRef } from 'react'

export const usePerformance = (componentName) => {
  const renderStartTime = useRef(performance.now())
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    const renderEndTime = performance.now()
    const renderTime = renderEndTime - renderStartTime.current

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`)
    }

    renderStartTime.current = performance.now()
  })

  return {
    renderCount: renderCount.current
  }
}

export const usePreload = (importFn, dependencies = []) => {
  useEffect(() => {
    const preload = async () => {
      try {
        await importFn()
      } catch (error) {
        console.warn('Preload failed:', error)
      }
    }

    preload()
  }, dependencies)
}

export const measurePerformance = (name, fn) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${(end - start).toFixed(2)}ms`)
  }

  return result
}

