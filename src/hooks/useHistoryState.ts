import { useCallback, useState } from 'react'

interface HistoryBucket<T> {
  past: T[]
  present: T
  future: T[]
}

export function useHistoryState<T>(initialValue: T, maxHistory = 40) {
  const [bucket, setBucket] = useState<HistoryBucket<T>>({
    past: [],
    present: initialValue,
    future: [],
  })

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setBucket((curr) => {
        const resolved =
          typeof next === 'function' ? (next as (prev: T) => T)(curr.present) : next
        if (Object.is(resolved, curr.present)) return curr
        const nextPast = [...curr.past, curr.present].slice(-maxHistory)
        return { past: nextPast, present: resolved, future: [] }
      })
    },
    [maxHistory],
  )

  const undo = useCallback(() => {
    setBucket((curr) => {
      if (curr.past.length === 0) return curr
      const previous = curr.past[curr.past.length - 1]
      return {
        past: curr.past.slice(0, -1),
        present: previous,
        future: [curr.present, ...curr.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setBucket((curr) => {
      if (curr.future.length === 0) return curr
      const next = curr.future[0]
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: curr.future.slice(1),
      }
    })
  }, [])

  const reset = useCallback((value: T) => {
    setBucket((curr) => ({
      past: [...curr.past, curr.present].slice(-maxHistory),
      present: value,
      future: [],
    }))
  }, [maxHistory])

  return {
    state: bucket.present,
    set,
    undo,
    redo,
    reset,
    canUndo: bucket.past.length > 0,
    canRedo: bucket.future.length > 0,
  }
}
