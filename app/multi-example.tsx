'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { AsyncMultiCombobox } from '@/registry/components/async-multi-combobox'
import { useDebounce } from '@/registry/hooks/use-debounce'
import { usePaginatedQuery } from 'convex/react'
import { useState } from 'react'

export function MultiExample() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.pokemon.simple,
    { query: debouncedQuery },
    { initialNumItems: 10 },
  )

  const isLoadingMore = status === 'LoadingMore'

  const [value, setValue] = useState<typeof results>([])

  return (
    <AsyncMultiCombobox
      inputValue={query}
      onInputValueChange={setQuery}
      items={results}
      value={value}
      onValueChange={setValue}
      itemToStringLabel={(item) => item.displayName}
      itemToStringValue={(item) => item._id}
      isItemEqualToValue={(item, value) => item._id === value._id}
      hasMore={status === 'CanLoadMore'}
      isLoading={isLoading && !isLoadingMore}
      isLoadingMore={isLoadingMore}
      renderLoadingMore={() =>
        ['h-3.5 w-16', 'h-3.5 w-20'].map((className, index) => (
          <div key={index} className="flex h-7 items-center px-1.5">
            <Skeleton className={className} />
          </div>
        ))
      }
      onLoadMore={() => {
        if (!isLoading) loadMore(10)
      }}
      placeholder="Add pokemon"
    />
  )
}
