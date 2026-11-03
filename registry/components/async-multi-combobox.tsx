'use client'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { InputGroupAddon } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import type { ReactNode } from 'react'

import {
  AsyncComboboxContent,
  type AsyncComboboxSharedProps,
} from './async-combobox-shared'

type Props<T> = AsyncComboboxSharedProps<T> & {
  value?: Array<T>
  onValueChange?: (value: Array<T>) => void
  inputValue?: string
  onInputValueChange?: (value: string) => void
  /** Render a custom ComboboxChip with a stable key. */
  renderChip?: (item: T) => ReactNode
}

export function AsyncMultiCombobox<T>({
  items = [],
  value,
  onValueChange,
  itemToStringLabel = String,
  itemToStringValue = itemToStringLabel,
  isItemEqualToValue,
  hasMore = false,
  onLoadMore,
  scrollThreshold,
  inputValue,
  onInputValueChange,
  isLoading = false,
  isLoadingMore = false,
  disabled = false,
  'aria-invalid': ariaInvalid,
  placeholder,
  className,
  renderItem,
  renderChip,
  renderEmpty,
  renderLoading,
  renderLoadingMore,
}: Props<T>) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox<T, true>
      items={items}
      multiple
      disabled={disabled}
      value={value}
      onValueChange={onValueChange}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      isItemEqualToValue={isItemEqualToValue}
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
      filter={null}
    >
      <ComboboxChips ref={anchor} className={className}>
        <ComboboxValue>
          {(selectedValue: Array<T>) =>
            selectedValue.map((item) =>
              renderChip ? (
                renderChip(item)
              ) : (
                <ComboboxChip key={itemToStringValue(item)}>
                  {itemToStringLabel(item)}
                </ComboboxChip>
              ),
            )
          }
        </ComboboxValue>
        <ComboboxChipsInput
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
        />
        {/* Reserve the spinner's space so loading does not resize the anchor. */}
        <InputGroupAddon
          align="inline-end"
          className="ml-auto w-4 shrink-0 p-0"
        >
          {(isLoading || isLoadingMore) && <Spinner />}
        </InputGroupAddon>
      </ComboboxChips>
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
