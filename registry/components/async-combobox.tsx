'use client'

import {
  Combobox,
  ComboboxTrigger,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { cn } from 'cn'
import { XIcon } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import {
  AsyncComboboxContent,
  type AsyncComboboxSharedProps,
} from './async-combobox-shared'

type Props<T> = AsyncComboboxSharedProps<T> & {
  value?: T
  onValueChange?: (value: T | undefined) => void
  onQueryChange?: (query: string) => void
  showClear?: boolean
  id?: string
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
      input.select()
    }
  }, [showRichValue, selectedLabel])

  function changeEditing(editing: boolean) {
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
      <InputGroup
        ref={anchor}
        className={cn(
          'w-auto',
          className,
          showRichValue && '[&>input]:opacity-0',
        )}
      >
        <ComboboxPrimitive.Input
          ref={inputRef}
          render={<InputGroupInput disabled={disabled} />}
          id={id}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          onFocus={(event) => startEditing(event.currentTarget)}
          onPointerDown={(event) => {
            if (!showRichValue || disabled) return
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
        />
        {showRichValue && (
          <div
            aria-hidden="true"
            data-slot="combobox-selected-value"
            className="pointer-events-none absolute inset-y-0 right-10 left-2.5 flex min-w-0 items-center overflow-hidden text-sm"
          >
            <div className="w-full truncate">{renderValue(value)}</div>
          </div>
        )}
        <InputGroupAddon align="inline-end">
          {isLoading || isLoadingMore ? (
            <span className="mr-[-0.3rem] flex size-6 items-center justify-center">
              <Spinner />
            </span>
          ) : (
            <>
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                render={<ComboboxTrigger />}
                data-slot="input-group-button"
                className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
                disabled={disabled}
              />
              {showClear && (
                <ComboboxPrimitive.Clear
                  data-slot="combobox-clear"
                  render={<InputGroupButton variant="ghost" size="icon-xs" />}
                  disabled={disabled}
                >
                  <XIcon className="pointer-events-none" />
                </ComboboxPrimitive.Clear>
              )}
            </>
          )}
        </InputGroupAddon>
      </InputGroup>
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
