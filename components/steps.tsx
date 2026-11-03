import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export function Steps({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="steps"
      className={cn(
        'border-border ml-4 min-w-0 border-l pt-2 pl-8 [counter-reset:step]',
        className,
      )}
      {...props}
    />
  )
}

export function Step({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="step"
      className={cn(
        'before:bg-muted before:text-foreground before:ring-background relative mt-8 mb-4 text-sm leading-7 font-medium [counter-increment:step] before:absolute before:top-0 before:-left-[47px] before:flex before:size-7 before:items-center before:justify-center before:rounded-full before:font-mono before:text-sm before:font-normal before:ring-4 before:content-[counter(step)] first:mt-0',
        className,
      )}
      {...props}
    />
  )
}
