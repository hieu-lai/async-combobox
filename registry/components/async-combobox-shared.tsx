'use client'

import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteScroll } from '@/registry/hooks/use-infinite-scroll'
import { useState } from 'react'
import type { AriaAttributes, ComponentProps, ReactNode } from 'react'

type AsyncComboboxOptionsProps<T> = {
  itemToStringLabel?: (item: T) => string
  itemToStringValue?: (item: T) => string
  hasMore?: boolean
  onLoadMore?: () => void
  /** Load-more threshold: fraction (0–1), percentage, or pixel distance before the end. Defaults to '0px'. */
  scrollThreshold?: number | string
  /** Loading the first page or results for a new search. Keeps supplied items visible. */
  isLoading?: boolean
  /** Loading another page. Keeps existing options visible. */
  isLoadingMore?: boolean
  /** Render a custom ComboboxItem with a stable key and value={item}. */
  renderItem?: (item: T) => ReactNode
  /** Render loading content when no items are available. Defaults to skeleton rows. */
  renderLoading?: () => ReactNode
  /** Render non-selectable content after the options when loading another page. Defaults to nothing. */
  renderLoadingMore?: () => ReactNode
}

export type AsyncComboboxSharedProps<T> = AsyncComboboxOptionsProps<T> & {
  items?: Array<T>
  isItemEqualToValue?: (item: T, value: T) => boolean
  disabled?: boolean
  /** Mark the input invalid and apply the destructive border and ring. */
  'aria-invalid'?: AriaAttributes['aria-invalid']
  placeholder?: string
  /** Classes for the field wrapper, including width utilities such as w-64 or max-w-xs. */
  className?: string
  /** Render a custom ComboboxEmpty. Defaults to "No items found." */
  renderEmpty?: () => ReactNode
}

type InfiniteListProps<T> = AsyncComboboxOptionsProps<T> & {
  dataLength: number
}

type AsyncComboboxContentProps<T> = InfiniteListProps<T> & {
  anchor: ComponentProps<typeof ComboboxContent>['anchor']
  renderEmpty?: AsyncComboboxSharedProps<T>['renderEmpty']
}

export function AsyncComboboxContent<T>({
  anchor,
  renderEmpty,
  isLoading = false,
  isLoadingMore = false,
  ...listProps
}: AsyncComboboxContentProps<T>) {
  return (
    <ComboboxContent anchor={anchor}>
      {!isLoading &&
        !isLoadingMore &&
        (renderEmpty ? (
          renderEmpty()
        ) : (
          <ComboboxEmpty>No items found.</ComboboxEmpty>
        ))}
      <InfiniteComboboxList
        {...listProps}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
      />
    </ComboboxContent>
  )
}

function InfiniteComboboxList<T>({
  dataLength,
  hasMore = false,
  onLoadMore,
  scrollThreshold,
  isLoading = false,
  isLoadingMore = false,
  itemToStringLabel = String,
  itemToStringValue = itemToStringLabel,
  renderItem,
  renderLoading,
  renderLoadingMore,
}: InfiniteListProps<T>) {
  const [list, setList] = useState<HTMLDivElement | null>(null)
  const canLoadMore =
    hasMore && onLoadMore != null && !isLoading && !isLoadingMore

  const { sentinelRef } = useInfiniteScroll({
    dataLength,
    hasMore: canLoadMore && list !== null,
    next: () => onLoadMore?.(),
    scrollableTarget: list,
    scrollThreshold,
  })

  return (
    <ComboboxList ref={setList} aria-busy={isLoading || isLoadingMore}>
      <ComboboxCollection>
        {(item: T) =>
          renderItem ? (
            renderItem(item)
          ) : (
            <ComboboxItem key={itemToStringValue(item)} value={item}>
              {itemToStringLabel(item)}
            </ComboboxItem>
          )
        }
      </ComboboxCollection>
      {isLoading &&
        dataLength === 0 &&
        (renderLoading ? (
          renderLoading()
        ) : (
          <div aria-hidden="true" className="p-1">
            {['h-3.5 w-16', 'h-3.5 w-20', 'h-3.5 w-22', 'h-3.5 w-16'].map(
              (className, index) => (
                <div key={index} className="flex h-7 items-center px-1.5">
                  <Skeleton className={className} />
                </div>
              ),
            )}
          </div>
        ))}
      {!isLoading && isLoadingMore && renderLoadingMore?.()}
      {canLoadMore && (
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      )}
    </ComboboxList>
  )
}
