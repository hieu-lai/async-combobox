import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { InputGroupAddon } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useInfiniteScroll } from 'react-infinite-scroll-component'

type InfiniteListProps<T> = {
  dataLength: number
  hasMore: boolean
  onLoadMore: () => void
  itemToStringLabel: (item: T) => string
  itemToStringValue: (item: T) => string
  renderItem?: (item: T) => ReactNode
}

function InfiniteComboboxList<T>({
  dataLength,
  hasMore,
  onLoadMore,
  itemToStringLabel,
  itemToStringValue,
  renderItem,
}: InfiniteListProps<T>) {
  const [list, setList] = useState<HTMLDivElement | null>(null)

  const { sentinelRef } = useInfiniteScroll({
    dataLength,
    hasMore: hasMore && list !== null,
    next: onLoadMore,
    scrollableTarget: list,
    scrollThreshold: '0px',
  })

  return (
    <ComboboxList ref={setList}>
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
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
    </ComboboxList>
  )
}

type Props<T> = {
  items: Array<T>
  value: Array<T>
  onValueChange?: (value: Array<T>) => void
  itemToStringLabel?: (item: T) => string
  itemToStringValue?: (item: T) => string
  isItemEqualToValue?: (item: T, value: T) => boolean
  hasMore: boolean
  onLoadMore: () => void
  inputValue: string
  onInputValueChange: (value: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  /** Render a custom ComboboxItem with a stable key and value={item}. */
  renderItem?: (item: T) => ReactNode
  /** Render a custom ComboboxChip with a stable key. */
  renderChip?: (item: T) => ReactNode
}

export function AsyncMultiCombobox<T>({
  items,
  value,
  onValueChange,
  itemToStringLabel = String,
  itemToStringValue = itemToStringLabel,
  isItemEqualToValue,
  hasMore,
  onLoadMore,
  inputValue,
  onInputValueChange,
  isLoading = false,
  disabled = false,
  placeholder,
  renderItem,
  renderChip,
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
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {value.map((item) =>
            renderChip ? (
              renderChip(item)
            ) : (
              <ComboboxChip key={itemToStringValue(item)}>
                {itemToStringLabel(item)}
              </ComboboxChip>
            ),
          )}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={placeholder} />
        {isLoading && (
          <InputGroupAddon align="inline-end" className="ml-auto shrink-0 p-0">
            <Spinner />
          </InputGroupAddon>
        )}
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <InfiniteComboboxList
          dataLength={items.length}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          itemToStringLabel={itemToStringLabel}
          itemToStringValue={itemToStringValue}
          renderItem={renderItem}
        />
      </ComboboxContent>
    </Combobox>
  )
}
