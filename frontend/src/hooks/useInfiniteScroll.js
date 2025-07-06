"use client"

import { useEffect, useCallback, useRef } from "react"

export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef()

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            callback()
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        },
      )

      if (node) observer.current.observe(node)
    },
    [callback, hasMore, isLoading],
  )

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return lastElementRef
}
