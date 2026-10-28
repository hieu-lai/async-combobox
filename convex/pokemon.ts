import {
  paginationOptsValidator,
  paginationResultValidator,
} from 'convex/server'
import { v } from 'convex/values'

import { internalMutation, query } from './_generated/server'
import pokemon from './data/pokemon.json'
import schema from './schema'

export const simple = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(
    schema.doc('pokemon').pick('_id', 'displayName'),
  ),
  handler: async (ctx, args) => {
    const searchText = args.query.trim()

    const result = searchText
      ? await ctx.db
          .query('pokemon')
          .withSearchIndex('search_searchText', (q) =>
            q.search('searchText', searchText),
          )
          .paginate(args.paginationOpts)
      : await ctx.db
          .query('pokemon')
          .withIndex('by_pokemon_id')
          .paginate(args.paginationOpts)

    return {
      ...result,
      page: result.page.map(({ _id, displayName }) => ({ _id, displayName })),
    }
  },
})

// CLI only. A single transaction imports the complete cached Gen 1 dataset.
export const seed = internalMutation({
  args: {},
  returns: v.object({
    inserted: v.number(),
    updated: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx) => {
    if (
      pokemon.length !== 151 ||
      pokemon.some((row, index) => row.id !== index + 1)
    ) {
      throw new Error('Expected exactly Pokémon #1–151 in Pokédex order')
    }

    let inserted = 0
    let updated = 0
    let skipped = 0
    for (const row of pokemon) {
      const existing = await ctx.db
        .query('pokemon')
        .withIndex('by_pokemon_id', (q) => q.eq('id', row.id))
        .unique()

      if (!existing) {
        await ctx.db.insert('pokemon', row)
        inserted += 1
      } else {
        if (
          Object.entries(row).every(
            ([key, value]) =>
              JSON.stringify(existing[key as keyof typeof row]) ===
              JSON.stringify(value),
          )
        ) {
          skipped += 1
        } else {
          await ctx.db.replace('pokemon', existing._id, row)
          updated += 1
        }
      }
    }

    return { inserted, updated, skipped }
  },
})
