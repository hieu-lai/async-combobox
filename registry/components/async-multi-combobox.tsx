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
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { useInfiniteScroll } from '@/registry/hooks/use-infinite-scroll'
import { useState } from 'react'
import type { AriaAttributes, ReactNode } from 'react'

type InfiniteListProps<T> = {
  dataLength: number
  hasMore: boolean
  onLoadMore?: () => void
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
  const canLoadMore =
    hasMore && onLoadMore != null && !isLoading && !isLoadingMore

  const { sentinelRef } = useInfiniteScroll({
    dataLength,
    hasMore: canLoadMore && list !== null,
    next: () => onLoadMore?.(),
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
  items?: Array<T>
  value?: Array<T>
  onValueChange?: (value: Array<T>) => void
  itemToStringLabel?: (item: T) => string
  itemToStringValue?: (item: T) => string
  isItemEqualToValue?: (item: T, value: T) => boolean
  hasMore?: boolean
  onLoadMore?: () => void
  inputValue?: string
  onInputValueChange?: (value: string) => void
  /** Loading the first page or results for a new search. Keeps supplied items visible. */
  isLoading?: boolean
  /** Loading another page. Keeps existing options visible. */
  isLoadingMore?: boolean
  disabled?: boolean
  /** Mark the input invalid and apply the destructive border and ring. */
  'aria-invalid'?: AriaAttributes['aria-invalid']
  placeholder?: string
  className?: string
  /** Render a custom ComboboxItem with a stable key and value={item}. */
  renderItem?: (item: T) => ReactNode
  /** Render a custom ComboboxChip with a stable key. */
  renderChip?: (item: T) => ReactNode
  /** Render a custom ComboboxEmpty. Defaults to "No items found." */
  renderEmpty?: () => ReactNode
  /** Render loading content when no items are available. Defaults to skeleton rows. */
  renderLoading?: () => ReactNode
  /** Render non-selectable content after the options when loading another page. Defaults to nothing. */
  renderLoadingMore?: () => ReactNode
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
