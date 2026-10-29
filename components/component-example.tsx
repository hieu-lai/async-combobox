import type { ReactNode } from 'react'

import {
  ComponentPreview,
  type ComponentPreviewProps,
} from '@/components/component-preview'
import { cn } from '@/lib/utils'

type ComponentExampleProps = Omit<
  ComponentPreviewProps,
  'id' | 'title' | 'className'
> & {
  /** A unique, stable fragment identifier for linking to this example. */
  id: string
  title: string
  description?: ReactNode
  className?: string
}

function ComponentExample({
  id,
  title,
  description,
  children,
  className,
  previewClassName,
  ...previewProps
}: ComponentExampleProps) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn('flex min-w-0 scroll-mt-6 flex-col gap-5', className)}
    >
      <h2 id={headingId} className="text-lg font-semibold">
        <a
          href={`#${id}`}
          className="group focus-visible:outline-ring inline-flex items-center gap-2 rounded-sm outline-offset-4 focus-visible:outline-2"
        >
          <span className="underline-offset-4 group-hover:underline group-focus-visible:underline">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            #
          </span>
        </a>
      </h2>
      {description && (
        <div className="[&_code]:bg-muted text-sm leading-relaxed [&_code]:rounded-sm [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]">
          {description}
        </div>
      )}
      <ComponentPreview
        {...previewProps}
        previewClassName={cn('min-h-72 sm:min-h-72', previewClassName)}
      >
        {children}
      </ComponentPreview>
    </section>
  )
}

export { ComponentExample, type ComponentExampleProps }
