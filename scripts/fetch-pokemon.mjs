import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { pokemonDisplayName } from '../lib/pokemon.mjs'

const destination = new URL('../convex/data/pokemon.json', import.meta.url)

// Reuse the local snapshot unless a manual refresh is explicitly requested.
if (!process.argv.includes('--refresh')) {
  try {
    await readFile(destination)
    console.log('Using cached snapshot. Pass --refresh to fetch current data.')
    process.exit(0)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

const pokemon = []
for (let start = 1; start <= 151; start += 5) {
  const batch = await Promise.all(
    Array.from({ length: Math.min(5, 152 - start) }, async (_, offset) => {
      const id = start + offset
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`, {
        signal: AbortSignal.timeout(30_000),
      })
      if (!response.ok)
        throw new Error(`Pokémon ${id}: HTTP ${response.status}`)
      const data = await response.json()
      if (
        data.id !== id ||
        !data.is_default ||
        typeof data.name !== 'string' ||
        !Number.isFinite(data.height) ||
        !Number.isFinite(data.weight) ||
        typeof data.sprites?.front_default !== 'string'
      ) {
        throw new Error(`Invalid Pokémon ${id}`)
      }
      const types = data.types
        .sort((a, b) => a.slot - b.slot)
        .map(({ type }) => type.name)
      const abilities = data.abilities
        .sort((a, b) => a.slot - b.slot)
        .map(({ ability }) => ability.name)
      if (
        types.length === 0 ||
        abilities.length === 0 ||
        ![...types, ...abilities].every((name) => typeof name === 'string')
      ) {
        throw new Error(`Invalid types or abilities for Pokémon ${id}`)
      }
      return {
        id,
        name: data.name,
        displayName: pokemonDisplayName(data.name),
        height: data.height,
        weight: data.weight,
        image: data.sprites.front_default,
        types,
        abilities,
        searchText: [data.name, ...types, ...abilities].join(' '),
      }
    }),
  )
  pokemon.push(...batch)
}

// Write only after every request succeeds, preserving an existing good snapshot.
await mkdir(new URL('../convex/data/', import.meta.url), { recursive: true })
await writeFile(destination, `${JSON.stringify(pokemon, null, 2)}\n`)
console.log(`Cached ${pokemon.length} Pokémon in convex/data/pokemon.json`)
