'use client'

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteScroll } from '@/registry/hooks/use-infinite-scroll'
import { useState } from 'react'
import type { ReactNode } from 'react'

type InfiniteListProps<T> = {
  dataLength: number
  hasMore: boolean
  onLoadMore: () => void
  isLoading: boolean
  isLoadingMore: boolean
  itemToStringLabel: (item: T) => string
  itemToStringValue: (item: T) => string
  renderItem?: (item: T) => ReactNode
  renderLoading?: () => ReactNode
  renderLoadingMore?: () => ReactNode
}

function InfiniteComboboxList<T>({
  dataLength,
  hasMore,
  onLoadMore,
  isLoading,
  isLoadingMore,
  itemToStringLabel,
  itemToStringValue,
  renderItem,
  renderLoading,
  renderLoadingMore,
}: InfiniteListProps<T>) {
  const [list, setList] = useState<HTMLDivElement | null>(null)
  const canLoadMore = hasMore && !isLoading && !isLoadingMore

  const { sentinelRef } = useInfiniteScroll({
    dataLength,
    hasMore: canLoadMore && list !== null,
    next: onLoadMore,
    scrollableTarget: list,
    scrollThreshold: '0px',
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

type Props<T> = {
  items: Array<T>
  value?: T
  onValueChange?: (value: T | undefined) => void
  itemToStringLabel?: (item: T) => string
  itemToStringValue?: (item: T) => string
  isItemEqualToValue?: (item: T, value: T) => boolean
  /** Search term changes from editing or clearing. Selection resets it to an empty string. */
  onQueryChange: (query: string) => void
  hasMore: boolean
  onLoadMore: () => void
  /** Loading the first page or results for a new search. Keeps supplied items visible. */
  isLoading?: boolean
  /** Loading another page. Keeps existing options visible. */
  isLoadingMore?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Show a clear button when an item is selected. Also resets the query. Defaults to true. */
  showClear?: boolean
  /** Connect an external label to the input. */
  id?: string
  /** Render a custom ComboboxItem with a stable key and value={item}. */
  renderItem?: (item: T) => ReactNode
  /** Render a custom ComboboxEmpty. Defaults to "No items found." */
  renderEmpty?: () => ReactNode
  /** Render loading content when no items are available. Defaults to skeleton rows. */
  renderLoading?: () => ReactNode
  /** Render non-selectable content after the options when loading another page. Defaults to nothing. */
  renderLoadingMore?: () => ReactNode
}

export function AsyncCombobox<T>({
  items,
  value,
  onValueChange,
  itemToStringLabel = String,
  itemToStringValue = itemToStringLabel,
  isItemEqualToValue,
  hasMore,
  onLoadMore,
  isLoading = false,
  isLoadingMore = false,
  disabled = false,
  placeholder,
  className,
  showClear = true,
  id,
  renderItem,
  renderEmpty,
  renderLoading,
  renderLoadingMore,
  onQueryChange,
}: Props<T>) {
  const anchor = useComboboxAnchor()
  const [inputValue, setInputValue] = useState(() =>
    value == null ? '' : itemToStringLabel(value),
  )

  return (
    <Combobox<T>
      items={items}
      disabled={disabled}
      value={value ?? null}
      onValueChange={(value) => {
        onValueChange?.(value ?? undefined)
        if (value != null) onQueryChange('')
      }}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isItemEqualToValue}
      inputValue={inputValue}
      onInputValueChange={(text, details) => {
        // Selection fills the editable input without searching for its label.
        setInputValue(text)
        if (
          details.reason === 'input-change' ||
          details.reason === 'input-clear' ||
          details.reason === 'clear-press'
        ) {
          onQueryChange(text)
        }
      }}
      filter={null}
    >
      <ComboboxInput
        anchorRef={anchor}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        showClear={showClear}
        isLoading={isLoading || isLoadingMore}
      />
      <ComboboxContent anchor={anchor}>
        {!isLoading &&
          !isLoadingMore &&
          (renderEmpty ? (
            renderEmpty()
          ) : (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          ))}
        <InfiniteComboboxList
          dataLength={items.length}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          itemToStringLabel={itemToStringLabel}
          itemToStringValue={itemToStringValue}
          renderItem={renderItem}
          renderLoading={renderLoading}
          renderLoadingMore={renderLoadingMore}
        />
      </ComboboxContent>
    </Combobox>
  )
}
