import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  pokemon: defineTable({
    id: v.number(),
    name: v.string(),
    displayName: v.string(),
    height: v.number(),
    weight: v.number(),
    image: v.string(),
    types: v.array(v.string()),
    abilities: v.array(v.string()),
    searchText: v.string(),
  })
    .index('by_pokemon_id', ['id'])
    .searchIndex('search_searchText', { searchField: 'searchText' }),
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }).index('by_text', ['text']),
})
