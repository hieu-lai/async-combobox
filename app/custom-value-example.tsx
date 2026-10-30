'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ComboboxItem } from '@/components/ui/combobox'
import { api } from '@/convex/_generated/api'
import { pokemonTypeMap, type PokemonType } from '@/lib/pokemon-types'
import { AsyncCombobox } from '@/registry/components/async-combobox'
import { useDebounce } from '@/registry/hooks/use-debounce'
import { usePaginatedQuery } from 'convex/react'
import Image from 'next/image'
import { useState } from 'react'

function isPokemonType(type: string): type is PokemonType {
  return Object.hasOwn(pokemonTypeMap, type)
}

export function CustomValueExample() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.pokemon.rich,
    { query: debouncedQuery },
    { initialNumItems: 10 },
  )

  const isLoadingMore = status === 'LoadingMore'

  const [value, setValue] = useState<(typeof results)[number] | undefined>()

  return (
    <AsyncCombobox
      id="custom-value-pokemon"
      items={results}
      value={value}
      onValueChange={setValue}
      itemToStringLabel={(pokemon) => pokemon.displayName}
      itemToStringValue={(pokemon) => pokemon._id}
      isItemEqualToValue={(item, value) => item._id === value._id}
      onQueryChange={setQuery}
      placeholder="Select a Pokémon"
      className="w-80"
      hasMore={status === 'CanLoadMore'}
      isLoading={isLoading && !isLoadingMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={() => loadMore(10)}
      renderValue={(pokemon) => (
        <span className="flex min-w-0 items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback>JD</AvatarFallback>
            <AvatarImage
              keepMounted
              render={
                <Image
                  src={pokemon.image}
                  alt={pokemon.displayName}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              }
            />
          </Avatar>
          <span className="truncate">{pokemon.displayName}</span>
        </span>
      )}
      renderItem={(pokemon) => (
        <ComboboxItem key={pokemon._id} value={pokemon}>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback>
                  {pokemon.displayName.slice(0, 1)}
                </AvatarFallback>
                <AvatarImage
                  keepMounted
                  render={
                    <Image
                      src={pokemon.image}
                      alt={pokemon.displayName}
                      width={24}
                      height={24}
                      className="size-full object-cover"
                    />
                  }
                />
              </Avatar>
              {pokemon.displayName}
            </div>
            <div className="flex items-center gap-1">
              {pokemon.types.filter(isPokemonType).map((type) => {
                const { color, icon: Icon } = pokemonTypeMap[type]

                return (
                  <div
                    className="flex size-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: color }}
                    key={type}
                  >
                    <Icon className="size-3" stroke="white" />
                  </div>
                )
              })}
            </div>
          </div>
        </ComboboxItem>
      )}
    />
  )
}
