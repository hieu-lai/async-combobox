import { v } from 'convex/values'

import { internalMutation, query } from './_generated/server'
import schema from './schema'

export const list = query({
  args: {},
  returns: v.array(schema.doc('tasks')),
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_creation_time')
      .order('desc')
      .take(100)
  },
})

// Run from the CLI; repeated runs preserve existing tasks and their completion state.
export const seed = internalMutation({
  args: {},
  returns: v.object({ inserted: v.number(), skipped: v.number() }),
  handler: async (ctx) => {
    const samples = [
      { text: 'Buy groceries for the week', isCompleted: false },
      { text: 'Water the balcony plants', isCompleted: true },
      { text: 'Read a chapter of a new book', isCompleted: false },
      { text: 'Book a dentist appointment', isCompleted: false },
      { text: 'Go for a morning walk', isCompleted: true },
      { text: 'Organize the downloads folder', isCompleted: false },
      { text: 'Try a new pasta recipe', isCompleted: false },
      { text: 'Plan a weekend hike', isCompleted: false },
      { text: 'Update the project README', isCompleted: true },
      { text: 'Practice guitar for 20 minutes', isCompleted: false },
      { text: 'Back up holiday photos', isCompleted: true },
      { text: 'Test Convex realtime queries', isCompleted: false },
    ]

    let inserted = 0
    for (const task of samples) {
      const existing = await ctx.db
        .query('tasks')
        .withIndex('by_text', (q) => q.eq('text', task.text))
        .first()

      if (!existing) {
        await ctx.db.insert('tasks', task)
        inserted += 1
      }
    }

    return { inserted, skipped: samples.length - inserted }
  },
})
