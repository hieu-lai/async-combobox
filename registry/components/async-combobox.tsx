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
import { cn } from 'cn'
import { useLayoutEffect, useRef, useState } from 'react'
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
  /** Classes for the field wrapper, including width utilities such as w-64 or max-w-xs. */
  className?: string
  /** Show a clear button when an item is selected. Also resets the query. Defaults to true. */
  showClear?: boolean
  /** Connect an external label to the input. */
  id?: string
  /** Render a custom ComboboxItem with a stable key and value={item}. */
  renderItem?: (item: T) => ReactNode
  /** Render single-line, non-interactive selected content. Focus switches to editable label text. */
  renderValue?: (item: T) => ReactNode
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
  renderValue,
  renderEmpty,
  renderLoading,
  renderLoadingMore,
  onQueryChange,
}: Props<T>) {
  const anchor = useComboboxAnchor()
  const [inputValue, setInputValue] = useState(() =>
    value == null ? '' : itemToStringLabel(value),
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const queryRef = useRef('')
  const editingRef = useRef(false)
  const [isEditing, setIsEditing] = useState(false)
  const selectedLabel = value == null ? '' : itemToStringLabel(value)
  const showRichValue = renderValue != null && value != null && !isEditing

  useLayoutEffect(() => {
    const input = inputRef.current
    if (showRichValue && input && input === document.activeElement) {
      // Soft keyboards and paste can insert text without a keydown event.
      input.select()
    }
  }, [showRichValue, selectedLabel])

  function changeEditing(editing: boolean) {
    // Focus can follow a clear or pointer event before React commits its state.
    editingRef.current = editing
    setIsEditing(editing)
  }

  function startEditing(input: HTMLInputElement) {
    if (!renderValue || disabled || editingRef.current) return
    changeEditing(true)
    setInputValue(selectedLabel)
    input.select()
  }

  function finishEditing() {
    changeEditing(false)
    if (queryRef.current !== '') {
      queryRef.current = ''
      onQueryChange('')
    }
  }

  return (
    <Combobox<T>
      items={items}
      disabled={disabled}
      value={value ?? null}
      onValueChange={(nextValue, details) => {
        if (renderValue) {
          // Escape cancels editing; explicitly clearing the input clears selection.
          if (details.reason === 'escape-key') {
            details.cancel()
            return
          }
          changeEditing(
            details.reason === 'clear-press' || details.reason === 'input-clear',
          )
          queryRef.current = ''
        }
        onValueChange?.(nextValue ?? undefined)
        if (
          nextValue != null ||
          (renderValue && details.reason === 'clear-press')
        ) {
          onQueryChange('')
        }
      }}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isItemEqualToValue}
      inputValue={renderValue && !isEditing ? selectedLabel : inputValue}
      onInputValueChange={(text, details) => {
        if (renderValue && details.reason === 'escape-key') {
          details.cancel()
          return
        }
        // Selection fills the editable input without searching for its label.
        setInputValue(text)
        if (renderValue) {
          if (details.reason === 'clear-press') {
            changeEditing(true)
          } else if (details.reason === 'input-change') {
            changeEditing(true)
            queryRef.current = text
            onQueryChange(text)
          }
          return
        }
        if (
          details.reason === 'input-change' ||
          details.reason === 'input-clear' ||
          details.reason === 'clear-press'
        ) {
          onQueryChange(text)
        }
      }}
      onOpenChange={(open) => {
        if (renderValue && !open) finishEditing()
      }}
      filter={null}
    >
      <ComboboxInput
        ref={inputRef}
        anchorRef={anchor}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(className, showRichValue && '[&>input]:opacity-0')}
        showClear={showClear}
        isLoading={isLoading || isLoadingMore}
        onFocus={(event) => startEditing(event.currentTarget)}
        onPointerDown={(event) => {
          if (!showRichValue || disabled) return
          // Keep the initial pointer press from collapsing the select-all range.
          event.preventDefault()
          event.currentTarget.focus()
          startEditing(event.currentTarget)
        }}
        onKeyDown={(event) => {
          if (!renderValue || event.nativeEvent.isComposing) return
          if (event.key === 'Escape') {
            finishEditing()
          } else if (
            event.key.length === 1 ||
            [
              'Backspace',
              'Delete',
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
              'End',
            ].includes(event.key)
          ) {
            startEditing(event.currentTarget)
          }
        }}
        onCompositionStart={(event) => startEditing(event.currentTarget)}
        onBlur={() => {
          if (renderValue) finishEditing()
        }}
      >
        {showRichValue && (
          <div
            aria-hidden="true"
            data-slot="combobox-selected-value"
            className="pointer-events-none absolute inset-y-0 right-10 left-2.5 flex min-w-0 items-center overflow-hidden text-sm"
          >
            <div className="w-full truncate">{renderValue(value)}</div>
          </div>
        )}
      </ComboboxInput>
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
