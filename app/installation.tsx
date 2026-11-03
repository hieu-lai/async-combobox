'use client'

import RectangleTerminalIcon from '@/components/icons/rectangle-terminal'
import TypeScriptIcon from '@/components/icons/typescript'
import { Step, Steps } from '@/components/steps'
import { Button } from '@/components/ui/button'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useHighlightedCode } from '@/hooks/use-highlighted-code'
import { cn } from '@/lib/utils'
import { useId, useState } from 'react'

const commands = {
  pnpm: 'pnpm dlx shadcn@latest add hieu-lai/async-combobox/async-comboboxes',
  npm: 'npx shadcn@latest add hieu-lai/async-combobox/async-comboboxes',
  yarn: 'yarn dlx shadcn@latest add hieu-lai/async-combobox/async-comboboxes',
  bun: 'bunx --bun shadcn@latest add hieu-lai/async-combobox/async-comboboxes',
}

type PackageManager = keyof typeof commands

const dependencyCommands = {
  pnpm: 'pnpm dlx shadcn@latest add combobox skeleton spinner input-group\npnpm add cn @base-ui/react@^1.9.0 lucide-react',
  npm: 'npx shadcn@latest add combobox skeleton spinner input-group\nnpm install cn @base-ui/react@^1.9.0 lucide-react',
  yarn: 'yarn dlx shadcn@latest add combobox skeleton spinner input-group\nyarn add cn @base-ui/react@^1.9.0 lucide-react',
  bun: 'bunx --bun shadcn@latest add combobox skeleton spinner input-group\nbun add cn @base-ui/react@^1.9.0 lucide-react',
}

type InstallationFile = { path: string; code: string }

export function Installation({ files }: { files: InstallationFile[] }) {
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
          <InstallationCommand
            commands={commands}
            packageManager={packageManager}
            onPackageManagerChange={setPackageManager}
          />
        </TabsContent>
        <TabsContent value="manual">
          <Steps>
            <Step>Install the required shadcn/ui dependencies.</Step>
            <InstallationCommand
              commands={dependencyCommands}
              packageManager={packageManager}
              onPackageManagerChange={setPackageManager}
            />
            <Step>Copy and paste the following code into your project.</Step>
            <div className="flex min-w-0 flex-col gap-4">
              {files.map((file) => (
                <InstallationSource key={file.path} file={file} />
              ))}
            </div>

            <Step>Update the import paths to match your project setup.</Step>
          </Steps>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function InstallationCommand({
  commands,
  packageManager,
  onPackageManagerChange,
}: {
  commands: Record<PackageManager, string>
  packageManager: PackageManager
  onPackageManagerChange: (value: PackageManager) => void
}) {
  return (
    <Tabs
      value={packageManager}
      onValueChange={(value) => onPackageManagerChange(value as PackageManager)}
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
  )
}

function InstallationSource({ file }: { file: InstallationFile }) {
  const [expanded, setExpanded] = useState(false)
  const sourceId = useId()
  const lines = useHighlightedCode(file.code, 'tsx')

  return (
    <CodeBlock className="bg-muted rounded-2xl border-0">
      <CodeBlockHeader className="border-input border-b px-4 py-3">
        <CodeBlockTitle>
          <TypeScriptIcon aria-hidden="true" className="size-5" />
          <span className="font-mono font-normal" title={file.path}>
            {file.path}
          </span>
        </CodeBlockTitle>
        <CodeBlockActions>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={sourceId}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${file.path}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
          <Separator orientation="vertical" className="mx-1 my-1" />
          <CodeBlockCopyButton
            value={file.code}
            aria-label={`Copy ${file.path}`}
          />
        </CodeBlockActions>
      </CodeBlockHeader>
      <div className="relative">
        <div
          id={sourceId}
          role="region"
          aria-label={`Source code: ${file.path}`}
          aria-hidden={!expanded}
          inert={!expanded}
          className={cn(!expanded && 'h-48 overflow-hidden')}
        >
          <CodeBlockContent
            lineNumbers
            className={cn(
              'max-h-120 px-4 py-4',
              !expanded && 'overflow-hidden',
            )}
          >
            {lines.map((line, index) => (
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))}
          </CodeBlockContent>
        </div>
        {!expanded && (
          <div className="from-muted/0 to-muted absolute inset-0 flex items-end justify-center bg-linear-to-b pb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-expanded={expanded}
              aria-controls={sourceId}
              aria-label={`Expand ${file.path}`}
              onClick={() => setExpanded(true)}
            >
              Expand
            </Button>
          </div>
        )}
      </div>
    </CodeBlock>
  )
}
