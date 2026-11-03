'use client'

import {
  Combobox,
  ComboboxInput,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { cn } from 'cn'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import {
  AsyncComboboxContent,
  type AsyncComboboxSharedProps,
} from './async-combobox-shared'

type Props<T> = AsyncComboboxSharedProps<T> & {
  value?: T
  onValueChange?: (value: T | undefined) => void
  /** Search term changes from editing or clearing. Selection resets it to an empty string. */
  onQueryChange?: (query: string) => void
  /** Show a clear button when an item is selected. Also resets the query. Defaults to true. */
  showClear?: boolean
  /** Connect an external label to the input. */
  id?: string
  /** Render single-line, non-interactive selected content. Focus switches to editable label text. */
  renderValue?: (item: T) => ReactNode
}

export function AsyncCombobox<T>({
  items = [],
  value,
  onValueChange,
  itemToStringLabel = String,
  itemToStringValue = itemToStringLabel,
  isItemEqualToValue,
  hasMore = false,
  onLoadMore,
  scrollThreshold,
  isLoading = false,
  isLoadingMore = false,
  disabled = false,
  'aria-invalid': ariaInvalid,
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
      onQueryChange?.('')
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
            details.reason === 'clear-press' ||
              details.reason === 'input-clear',
          )
          queryRef.current = ''
        }
        onValueChange?.(nextValue ?? undefined)
        if (
          nextValue != null ||
          (renderValue && details.reason === 'clear-press')
        ) {
          onQueryChange?.('')
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
            onQueryChange?.(text)
          }
          return
        }
        if (
          details.reason === 'input-change' ||
          details.reason === 'input-clear' ||
          details.reason === 'clear-press'
        ) {
          onQueryChange?.(text)
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
        aria-invalid={ariaInvalid}
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
      <AsyncComboboxContent
        anchor={anchor}
        renderEmpty={renderEmpty}
        dataLength={items.length}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        scrollThreshold={scrollThreshold}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        renderItem={renderItem}
        renderLoading={renderLoading}
        renderLoadingMore={renderLoadingMore}
      />
    </Combobox>
  )
}
