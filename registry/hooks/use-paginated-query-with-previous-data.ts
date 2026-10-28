'use client'

import { usePaginatedQuery } from 'convex/react'
import type {
  PaginatedQueryArgs,
  PaginatedQueryItem,
  PaginatedQueryReference,
  UsePaginatedQueryReturnType,
} from 'convex/react'
import { useState } from 'react'

/**
 * Keeps the last loaded results visible while the first page for new arguments
 * loads. Pagination status and loadMore always belong to the current query.
 * Passing "skip" clears the previous results.
 */
export function usePaginatedQueryWithPreviousData<
  Query extends PaginatedQueryReference,
>(
  query: Query,
  args: PaginatedQueryArgs<Query> | 'skip',
  options: { initialNumItems: number },
): UsePaginatedQueryReturnType<Query> & { isPlaceholderData: boolean } {
  const result = usePaginatedQuery(query, args, options)
  const [previousResults, setPreviousResults] =
    useState<Array<PaginatedQueryItem<Query>>>()

  const skipped = args === 'skip'
  const loadingFirstPage = result.status === 'LoadingFirstPage'

  // Keep the snapshot in React state so concurrent renders cannot overwrite it.
  if (skipped) {
    if (previousResults !== undefined) setPreviousResults(undefined)
  } else if (!loadingFirstPage && previousResults !== result.results) {
    setPreviousResults(result.results)
  }

  const isPlaceholderData =
    !skipped && loadingFirstPage && previousResults !== undefined

  return {
    ...result,
    results: isPlaceholderData ? previousResults : result.results,
    isPlaceholderData,
  }
}
