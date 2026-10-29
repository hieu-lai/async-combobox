'use client'

import { useId, useState, type ComponentProps } from 'react'
import { ChevronsUpIcon, FileCodeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block'
import { useHighlightedCode } from '@/hooks/use-highlighted-code'
import { cn } from '@/lib/utils'

type ComponentPreviewProps = ComponentProps<typeof Card> & {
  code: string
  language?: string
  filename?: string
  defaultExpanded?: boolean
  previewClassName?: string
  highlightedLines?: readonly number[]
}

function ComponentPreview({
  children,
  code,
  language,
  filename,
  defaultExpanded = false,
  previewClassName,
  highlightedLines = [],
  className,
  ...props
}: ComponentPreviewProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const sourceId = useId()
  const lines = useHighlightedCode(code, language ?? 'tsx')
  const hasHeader = Boolean(filename || language)
  const codeActions = (
    <CodeBlockActions>
      <CodeBlockCopyButton value={code} />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Hide Code"
        title="Hide Code"
        aria-expanded={expanded}
        aria-controls={sourceId}
        onClick={() => setExpanded(false)}
      >
        <ChevronsUpIcon aria-hidden="true" />
      </Button>
    </CodeBlockActions>
  )

  return (
    <Card
      data-slot="component-preview"
      className={cn('min-w-0 gap-0 rounded-2xl py-0', className)}
      {...props}
    >
      <CardContent
        data-slot="component-preview-content"
        className={cn(
          'flex min-h-80 min-w-0 items-center justify-center p-6 sm:min-h-108 sm:p-10',
          previewClassName,
        )}
      >
        {children}
      </CardContent>
      <CardFooter className="relative block min-w-0 p-0">
        <div
          id={sourceId}
          role="region"
          aria-label={filename ? `Source code: ${filename}` : 'Source code'}
          aria-hidden={!expanded}
          inert={!expanded}
          className={cn(!expanded && 'h-27 overflow-hidden')}
        >
          <CodeBlock className="rounded-none border-0">
            {expanded &&
              (hasHeader ? (
                <CodeBlockHeader className="px-6">
                  <CodeBlockTitle>
                    {filename && <FileCodeIcon aria-hidden="true" />}
                    {filename || language}
                  </CodeBlockTitle>
                  {codeActions}
                </CodeBlockHeader>
              ) : (
                codeActions
              ))}
            <CodeBlockContent
              key={expanded ? 'expanded' : 'collapsed'}
              lineNumbers
              aria-label="Source code"
              className={cn(
                'max-h-120 px-6 py-4',
                !expanded && 'overflow-hidden',
              )}
            >
              {lines.map((line, index) => (
                <CodeBlockLine
                  key={index}
                  variant={
                    highlightedLines.includes(index + 1)
                      ? 'highlighted'
                      : 'default'
                  }
                >
                  {line}
                </CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
        </div>
        {!expanded && (
          <div
            aria-hidden="true"
            className="from-muted/40 to-muted pointer-events-none absolute inset-0 bg-linear-to-b"
          />
        )}
        {!expanded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              aria-expanded={expanded}
              aria-controls={sourceId}
              onClick={() => setExpanded(true)}
            >
              View Code
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export { ComponentPreview, type ComponentPreviewProps }
