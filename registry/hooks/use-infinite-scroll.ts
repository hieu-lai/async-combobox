'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'

export type UseInfiniteScrollOptions = {
  /** Append the next page. Update dataLength when it arrives to allow another load. */
  next: () => void
  hasMore: boolean
  /** Total number of items in the accumulated list. */
  dataLength: number
  /** Fraction (0–1), percentage, or pixel distance before the end. Defaults to 0.8. */
  scrollThreshold?: number | string
  /** Scroll container or its DOM id. Omit to observe the browser viewport. */
  scrollableTarget?: HTMLElement | string | null
  /** Place the sentinel at the top of the list instead of the bottom. */
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
  // A callback ref also handles sentinels mounted after a popup opens or loading ends.
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

    // A missing explicit container must not fall back to observing the viewport.
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

        // Lock synchronously: multiple notifications can arrive before React renders.
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
