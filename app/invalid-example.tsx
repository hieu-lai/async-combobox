'use client'

import { api } from '@/convex/_generated/api'
import { AsyncCombobox } from '@/registry/components/async-combobox'
import { useDebounce } from '@/registry/hooks/use-debounce'
import { usePaginatedQuery } from 'convex/react'
import { useState } from 'react'

export function InvalidExample() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.pokemon.simple,
    { query: debouncedQuery },
    { initialNumItems: 10 },
  )

  const isLoadingMore = status === 'LoadingMore'

  const [value, setValue] = useState<(typeof results)[number] | undefined>()

  return (
    <AsyncCombobox
      aria-invalid
      className="w-full max-w-xs"
      onQueryChange={setQuery}
      items={results}
      value={value}
      onValueChange={setValue}
      itemToStringLabel={(item) => item.displayName}
      itemToStringValue={(item) => item._id}
      isItemEqualToValue={(item, value) => item._id === value._id}
      hasMore={status === 'CanLoadMore'}
      isLoading={isLoading && !isLoadingMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={() => loadMore(10)}
      placeholder="Select a Pokémon"
    />
  )
}
