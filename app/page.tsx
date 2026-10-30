import { ComponentExample } from '@/components/component-example'
import { ComponentPreview } from '@/components/component-preview'
import GitHubIcon from '@/components/icons/github'
import { buttonVariants } from '@/components/ui/button'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { CustomExample } from './custom-example'
import { CustomMultiExample } from './custom-multi-example'
import { DisabledExample } from './disabled-example'
import { Installation } from './installation'
import { InvalidExample } from './invalid-example'
import { MultiExample } from './multi-example'
import { SingleExample } from './single-example'

export default async function Home() {
  'use cache'

  const [
    singleExampleCode,
    multiExampleCode,
    customValueExampleCode,
    customMultiExampleCode,
    disabledExampleCode,
    invalidExampleCode,
  ] = await Promise.all([
    readFile(path.join(process.cwd(), 'app/single-example.tsx'), 'utf8'),
    readFile(path.join(process.cwd(), 'app/multi-example.tsx'), 'utf8'),
    readFile(path.join(process.cwd(), 'app/custom-example.tsx'), 'utf8'),
    readFile(path.join(process.cwd(), 'app/custom-multi-example.tsx'), 'utf8'),
    readFile(path.join(process.cwd(), 'app/disabled-example.tsx'), 'utf8'),
    readFile(path.join(process.cwd(), 'app/invalid-example.tsx'), 'utf8'),
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
          <a
            href="https://github.com/hieu-lai/async-combobox"
            className={buttonVariants({ className: 'mx-auto' })}
          >
            <GitHubIcon />
            GitHub
          </a>
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
          title="Custom Items and Value"
          description={
            <>
              Use <code>renderItem</code> to render custom items inside{' '}
              <code>ComboboxContent</code>, and <code>renderValue</code> to show
              the custom selected value.
            </>
          }
          code={customValueExampleCode}
        >
          <CustomExample />
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
        <ComponentExample
          id="custom-multiple"
          title="Multiple with Custom Items and Chips"
          description={
            <>
              Use <code>renderItem</code> and <code>renderChip</code> to show
              Pokémon avatars in the options and selected chips, with the same
              custom loaders as the single-selection example.
            </>
          }
          code={customMultiExampleCode}
        >
          <CustomMultiExample />
        </ComponentExample>
        <ComponentExample
          id="disabled"
          title="Disabled"
          description={
            <>
              Use the <code>disabled</code> prop to disable the combobox.
            </>
          }
          code={disabledExampleCode}
        >
          <DisabledExample />
        </ComponentExample>
        <ComponentExample
          id="invalid"
          title="Invalid"
          description={
            <>
              Use the <code>aria-invalid</code> prop to make the combobox
              invalid.
            </>
          }
          code={invalidExampleCode}
        >
          <InvalidExample />
        </ComponentExample>
      </div>
    </main>
  )
}
