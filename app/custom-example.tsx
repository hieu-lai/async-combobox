'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ComboboxItem } from '@/components/ui/combobox'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { pokemonTypeMap, type PokemonType } from '@/lib/pokemon-types'
import { AsyncCombobox } from '@/registry/components/async-combobox'
import { useDebounce } from '@/registry/hooks/use-debounce'
import { cn } from 'cn'
import { usePaginatedQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import Image from 'next/image'
import { useState } from 'react'

type Pokemon = FunctionReturnType<typeof api.pokemon.rich>['page'][number]

function isPokemonType(type: string): type is PokemonType {
  return Object.hasOwn(pokemonTypeMap, type)
}

export function CustomExample() {
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
      className="w-full max-w-xs"
      hasMore={status === 'CanLoadMore'}
      isLoading={isLoading && !isLoadingMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={() => loadMore(10)}
      renderValue={(pokemon) => <PokemonValue pokemon={pokemon} />}
      renderItem={(pokemon) => (
        <PokemonItem key={pokemon._id} pokemon={pokemon} />
      )}
      renderLoading={() => <PokemonLoading />}
      renderLoadingMore={() => <PokemonLoadingMore />}
    />
  )
}

export function PokemonValue({
  pokemon,
  size = 24,
}: {
  pokemon: Pokemon
  size?: number
}) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar style={{ width: size, height: size }}>
        <AvatarFallback>{pokemon.displayName.slice(0, 1)}</AvatarFallback>
        <AvatarImage
          keepMounted
          render={
            <Image
              src={pokemon.image}
              alt={pokemon.displayName}
              width={size}
              height={size}
              className="size-full object-cover"
            />
          }
        />
      </Avatar>
      <span className="truncate">{pokemon.displayName}</span>
    </span>
  )
}

export function PokemonItem({ pokemon }: { pokemon: Pokemon }) {
  return (
    <ComboboxItem value={pokemon}>
      <div className="flex flex-1 items-center justify-between">
        <PokemonValue pokemon={pokemon} />
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
  )
}

function PokemonLoadingRows({ widths }: { widths: string[] }) {
  return widths.map((className, index) => (
    <div
      key={index}
      className="flex h-7 items-center justify-between px-1.5 pr-8"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className={cn('h-3.5', className)} />
      </div>
      <Skeleton className="size-4 rounded-full" />
    </div>
  ))
}

export function PokemonLoading() {
  return (
    <div aria-hidden="true" className="p-1">
      <PokemonLoadingRows widths={['w-16', 'w-20', 'w-22', 'w-16']} />
    </div>
  )
}

export function PokemonLoadingMore() {
  return (
    <div aria-hidden="true">
      <PokemonLoadingRows widths={['w-16', 'w-22']} />
    </div>
  )
}
