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
  scrollThreshold?: number | string
  isLoading?: boolean
  isLoadingMore?: boolean
  renderItem?: (item: T) => ReactNode
  renderLoading?: () => ReactNode
  renderLoadingMore?: () => ReactNode
}

export type AsyncComboboxSharedProps<T> = AsyncComboboxOptionsProps<T> & {
  items?: Array<T>
  isItemEqualToValue?: (item: T, value: T) => boolean
  disabled?: boolean
  'aria-invalid'?: AriaAttributes['aria-invalid']
  placeholder?: string
  className?: string
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
