'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'

export type UseInfiniteScrollOptions = {
  next: () => void
  hasMore: boolean
  dataLength: number
  scrollThreshold?: number | string
  scrollableTarget?: HTMLElement | string | null
  inverse?: boolean
}

function getRootMargin(scrollThreshold: number | string, inverse: boolean) {
  let margin = '20%'

  if (typeof scrollThreshold === 'number') {
    margin = `${100 - scrollThreshold * 100}%`
  } else if (/^\d*\.?\d+px$/.test(scrollThreshold)) {
    margin = scrollThreshold
  } else if (/^\d*\.?\d+%$/.test(scrollThreshold)) {
    margin = `${100 - parseFloat(scrollThreshold)}%`
  }

  return inverse ? `${margin} 0px 0px 0px` : `0px 0px ${margin} 0px`
}

export function useInfiniteScroll({
  next,
  hasMore,
  dataLength,
  scrollThreshold = 0.8,
  scrollableTarget,
  inverse = false,
}: UseInfiniteScrollOptions) {
  const [sentinel, sentinelRef] = useState<HTMLDivElement | null>(null)
  const [loadState, setLoadState] = useState({ dataLength, isLoading: false })
  const actionTriggered = useRef(false)
  const loadNext = useEffectEvent(next)
  const rootMargin = getRootMargin(scrollThreshold, inverse)

  if (loadState.dataLength !== dataLength) {
    setLoadState({ dataLength, isLoading: false })
  }

  useEffect(() => {
    actionTriggered.current = false
  }, [dataLength])

  useEffect(() => {
    if (!hasMore || !sentinel || typeof IntersectionObserver === 'undefined') {
      return
    }

    const root =
      typeof scrollableTarget === 'string'
        ? document.getElementById(scrollableTarget)
        : (scrollableTarget ?? null)

    if (typeof scrollableTarget === 'string' && !root) return

    let active = true
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !active ||
          actionTriggered.current ||
          !entries.some(
            (entry) => entry.target === sentinel && entry.isIntersecting,
          )
        ) {
          return
        }

        actionTriggered.current = true
        setLoadState({ dataLength, isLoading: true })
        loadNext()
      },
      { root, rootMargin, threshold: 0 },
    )

    observer.observe(sentinel)
    return () => {
      active = false
      observer.disconnect()
    }
  }, [hasMore, sentinel, scrollableTarget, rootMargin, dataLength])

  return { sentinelRef, isLoading: hasMore && loadState.isLoading }
}
