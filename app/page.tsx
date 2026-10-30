import { ComponentExample } from '@/components/component-example'
import { ComponentPreview } from '@/components/component-preview'
import { Button } from '@/components/ui/button'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { Installation } from './installation'
import { CustomValueExample } from './custom-value-example'
import { MultiExample } from './multi-example'
import { SingleExample } from './single-example'

export default async function Home() {
  'use cache'

  const [singleExampleCode, multiExampleCode, customValueExampleCode] =
    await Promise.all([
      readFile(path.join(process.cwd(), 'app/single-example.tsx'), 'utf8'),
      readFile(path.join(process.cwd(), 'app/multi-example.tsx'), 'utf8'),
      readFile(
        path.join(process.cwd(), 'app/custom-value-example.tsx'),
        'utf8',
      ),
    ])

  return (
    <main className="flex flex-1">
      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-10 px-4 pt-40 pb-16 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h1 className="text-center text-5xl font-bold">Async Combobox</h1>
            <p className="text-center text-lg">
              The last async combobox you&apos;ll ever need.
            </p>
          </div>
          <Button className="mx-auto">Click me</Button>
        </div>
        <ComponentPreview
          code={singleExampleCode}
          previewClassName="min-h-72 sm:min-h-72"
        >
          <SingleExample />
        </ComponentPreview>
        <Installation />
        <ComponentExample
          id="basic"
          title="Basic"
          description="An async combobox with searchable Pokémon and infinite scrolling."
          code={singleExampleCode}
        >
          <SingleExample />
        </ComponentExample>
        <ComponentExample
          id="custom-value"
          title="Custom items and selected value"
          description="Customize options with Pokémon avatars and type icons using renderItem, and show the selected Pokémon’s avatar and name using renderValue."
          code={customValueExampleCode}
        >
          <CustomValueExample />
        </ComponentExample>
        <ComponentExample
          id="multiple"
          title="Multiple"
          description={
            <>
              An async combobox with multiple selection using{' '}
              <code>AsyncMultiCombobox</code>.
            </>
          }
          code={multiExampleCode}
        >
          <MultiExample />
        </ComponentExample>
      </div>
    </main>
  )
}
