'use client'

import { ComboboxChip } from '@/components/ui/combobox'
import { api } from '@/convex/_generated/api'
import { AsyncMultiCombobox } from '@/registry/components/async-multi-combobox'
import { useDebounce } from '@/registry/hooks/use-debounce'
import { usePaginatedQuery } from 'convex/react'
import { useState } from 'react'

import {
  PokemonItem,
  PokemonLoading,
  PokemonLoadingMore,
  PokemonValue,
} from './custom-example'

export function CustomMultiExample() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.pokemon.rich,
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
      itemToStringLabel={(pokemon) => pokemon.displayName}
      itemToStringValue={(pokemon) => pokemon._id}
      isItemEqualToValue={(item, value) => item._id === value._id}
      hasMore={status === 'CanLoadMore'}
      isLoading={isLoading && !isLoadingMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={() => loadMore(10)}
      placeholder="Select Pokémon"
      className="w-full max-w-xs"
      renderItem={(pokemon) => (
        <PokemonItem key={pokemon._id} pokemon={pokemon} />
      )}
      renderChip={(pokemon) => (
        <ComboboxChip key={pokemon._id} className="h-auto">
          <PokemonValue pokemon={pokemon} size={16} />
        </ComboboxChip>
      )}
      renderLoading={() => <PokemonLoading />}
      renderLoadingMore={() => <PokemonLoadingMore />}
    />
  )
}
