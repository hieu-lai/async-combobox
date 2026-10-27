'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'

export function TasksList() {
  const tasks = useQuery(api.tasks.list)

  if (tasks === undefined) {
    return <p role="status">Loading tasks from Convex…</p>
  }

  if (tasks.length === 0) {
    return <p>No tasks yet. Run the seed command to add sample tasks.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Showing {tasks.length} tasks (up to 100). Edit a task in your Convex
        dashboard to see this list update live.
      </p>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between gap-4"
          >
            <span>{task.text}</span>
            <span className="text-muted-foreground shrink-0 text-sm">
              {task.isCompleted ? 'Completed' : 'To do'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
