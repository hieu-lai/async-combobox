import { Migrations } from '@convex-dev/migrations'

import { pokemonDisplayName } from '../lib/pokemon.mjs'
import { components } from './_generated/api'
import { internalMutation } from './_generated/server'
import schema from './schema'

const migrations = new Migrations(components.migrations, {
  schema,
  internalMutation,
})

export const pokemonDisplayNames = migrations.define({
  table: 'pokemon',
  customRange: (query) => query.withIndex('by_pokemon_id'),
  migrateOne: (_ctx, pokemon) => {
    const displayName = pokemonDisplayName(pokemon.name)
    if (pokemon.displayName !== displayName) return { displayName }
  },
})
