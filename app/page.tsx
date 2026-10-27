import { TasksList } from './tasks-list'

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Convex tasks</h1>
      <TasksList />
    </main>
  )
}
