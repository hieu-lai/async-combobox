'use client'

import RectangleTerminalIcon from '@/components/icons/rectangle-terminal'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
} from '@/components/ui/code-block'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

const commands = {
  pnpm: 'pnpm dlx shadcn@latest add code-block',
  npm: 'npx shadcn@latest add code-block',
  yarn: 'yarn dlx shadcn@latest add code-block',
  bun: 'bunx --bun shadcn@latest add code-block',
}

type PackageManager = keyof typeof commands

export function Installation() {
  const [packageManager, setPackageManager] = useState<PackageManager>('bun')

  return (
    <section
      id="installation"
      aria-labelledby="installation-heading"
      className="flex min-w-0 scroll-mt-6 flex-col gap-5"
    >
      <h2 id="installation-heading" className="text-lg font-semibold">
        <a
          href="#installation"
          className="group inline-flex items-center gap-2"
        >
          <span className="underline-offset-4 group-hover:underline group-focus-visible:underline">
            Installation
          </span>
          <span
            aria-hidden="true"
            className="text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            #
          </span>
        </a>
      </h2>
      <Tabs defaultValue="command" className="gap-4">
        <TabsList
          variant="line"
          className="gap-6 p-0"
          aria-label="Installation method"
        >
          <TabsTrigger value="command" className="px-0">
            Command
          </TabsTrigger>
          <TabsTrigger value="manual" className="px-0">
            Manual
          </TabsTrigger>
        </TabsList>
        <TabsContent value="command">
          <Tabs
            value={packageManager}
            onValueChange={(value) =>
              setPackageManager(value as PackageManager)
            }
            className="gap-0"
          >
            <CodeBlock className="bg-muted rounded-2xl border-0">
              <CodeBlockHeader className="border-input border-b px-3 py-2">
                <RectangleTerminalIcon
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <TabsList className="p-0" aria-label="Package manager">
                  {Object.keys(commands).map((manager) => (
                    <TabsTrigger key={manager} value={manager}>
                      {manager}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <CodeBlockActions>
                  <CodeBlockCopyButton value={commands[packageManager]} />
                </CodeBlockActions>
              </CodeBlockHeader>
              {Object.entries(commands).map(([manager, command]) => (
                <TabsContent key={manager} value={manager}>
                  <CodeBlockContent className="px-4 py-4 group-has-data-[slot=code-block-header]/code-block:pt-4">
                    {command}
                  </CodeBlockContent>
                </TabsContent>
              ))}
            </CodeBlock>
          </Tabs>
        </TabsContent>
        <TabsContent value="manual">
          <p className="text-muted-foreground leading-relaxed">
            Copy the component source and install its dependencies using the{' '}
            <a
              href="https://ui.shadcn.com/docs/components/base/code-block#installation"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              manual installation guide
            </a>
            . Place the component in{' '}
            <code className="text-foreground font-mono">
              components/ui/code-block.tsx
            </code>
            .
          </p>
        </TabsContent>
      </Tabs>
    </section>
  )
}
