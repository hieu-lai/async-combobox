import { Installation } from './installation'
import { MultiExample } from './multi-example'

export default function Home() {
  return (
    <main className="flex flex-1">
      <div className="mx-auto w-full max-w-3xl pt-40">
        <div className="space-y-2">
          <h1 className="text-center text-5xl font-bold">Async Combobox</h1>
          <p className="text-center text-lg">
            The last async combobox you&apos;ll ever need.
          </p>
        </div>
        <Installation />
        <MultiExample />
      </div>
    </main>
  )
}
