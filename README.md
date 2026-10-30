# Async Combobox

Async single- and multi-select React comboboxes with search, infinite scrolling,
and customizable content. Built with Base UI, shadcn/ui, TypeScript, and Tailwind CSS.

Bring your own fetcher. The components receive items and loading state through
props and emit search and pagination callbacks. Use native `fetch`, an API client,
or your preferred data-fetching hook.

## Features

- Single selection with a clear button, or multiple selection with removable chips.
- Async search and infinite scrolling with a configurable load-more threshold.
- Separate loading states for new searches and additional pages.
- Custom option content, selected values, chips, loaders, and empty states.
- Keyboard navigation through Base UI, plus disabled and invalid states.
- Live examples with viewable, copyable source code in the demo app.

## Installation

Install both components from the GitHub registry into a project initialized with
shadcn/ui:

```bash
bunx --bun shadcn@latest add hieu-lai/async-combobox/async-comboboxes
```

Or install either component individually:

```bash
bunx --bun shadcn@latest add hieu-lai/async-combobox/async-combobox
bunx --bun shadcn@latest add hieu-lai/async-combobox/async-multi-combobox
```

Each item installs its components into your configured UI directory, the
`useInfiniteScroll` hook into your hooks directory, the supporting UI files, and
their npm dependencies. With the default aliases, import the components from
`@/components/ui/async-combobox` and `@/components/ui/async-multi-combobox`.

These items ship the repository's Base UI primitives, including the customized
`combobox.tsx` with loading support. Preview with `--dry-run` and review any
existing UI files before accepting replacement prompts, especially in projects
using another primitive library.

Use a React version that supports `useEffectEvent` (the demo uses React 19.3),
and Tailwind CSS 4 with shadcn theme variables; see [the demo stylesheet](app/globals.css).

### Manual installation

1. Copy either or both components:
   - [AsyncCombobox](registry/components/async-combobox.tsx)
   - [AsyncMultiCombobox](registry/components/async-multi-combobox.tsx)
2. Copy [useInfiniteScroll](registry/hooks/use-infinite-scroll.ts).
3. Copy the supporting files from `components/ui/`: `combobox.tsx`, `skeleton.tsx`,
   `spinner.tsx`, `input-group.tsx`, `button.tsx`, `input.tsx`, and `textarea.tsx`.
   The included combobox primitive contains the loading support used by these components.
4. Install their dependencies:

   ```bash
   bun add @base-ui/react cn class-variance-authority lucide-react
   ```

Adjust the `@/components/...` and `@/registry/...` imports to match your project.
Use the components inside a client component when working with React Server Components.

## Usage

Your data layer supplies the search results, loading flags, and pagination callback.
These wrappers manage selection while leaving fetching to the caller:

```tsx
'use client'

import { useState } from 'react'
import { AsyncCombobox } from '@/components/ui/async-combobox'
import { AsyncMultiCombobox } from '@/components/ui/async-multi-combobox'

type Option = { id: string; name: string }

type SearchResults = {
  items: Option[]
  onSearch: (query: string) => void
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function SingleSelect({ onSearch, ...data }: SearchResults) {
  const [value, setValue] = useState<Option | undefined>()

  return (
    <>
      <label htmlFor="single-option">Choose an option</label>
      <AsyncCombobox
        {...data}
        id="single-option"
        value={value}
        onValueChange={setValue}
        onQueryChange={onSearch}
        itemToStringLabel={(item) => item.name}
        itemToStringValue={(item) => item.id}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        className="w-full max-w-xs"
        placeholder="Search options"
      />
    </>
  )
}

export function MultiSelect({ onSearch, ...data }: SearchResults) {
  const [value, setValue] = useState<Option[]>([])

  return (
    <AsyncMultiCombobox
      {...data}
      value={value}
      onValueChange={setValue}
      onInputValueChange={onSearch}
      itemToStringLabel={(item) => item.name}
      itemToStringValue={(item) => item.id}
      isItemEqualToValue={(item, selected) => item.id === selected.id}
      className="w-full max-w-xs"
      placeholder="Search options"
    />
  )
}
```

### Connect any fetcher

The components do not make requests, debounce queries, filter items, or cache results.
Your data layer controls those behaviors:

| Event or state  | What your data layer should do                              |
| --------------- | ----------------------------------------------------------- |
| Search callback | Fetch the first page for the new query and replace `items`. |
| `onLoadMore`    | Fetch the next page and append it to `items`.               |
| `isLoading`     | Set while loading the first page or a new search.           |
| `isLoadingMore` | Set while fetching an additional page.                      |
| `hasMore`       | Indicate whether another page is available.                 |

Keep previously loaded items in `items` to retain them while loading, or pass an
empty array to show the initial loader. Reset pagination when the query changes,
and ignore stale responses when searches overlap. The optional
[useDebounce](registry/hooks/use-debounce.ts) hook can reduce search requests.

## Customization

| Prop                        | Purpose                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `renderItem`                | Render a custom `ComboboxItem` with a stable key and `value={item}`.                                |
| `renderValue`               | Customize the single-select value with single-line, non-interactive content.                        |
| `renderChip`                | Render a custom `ComboboxChip` for multi-select values.                                             |
| `renderEmpty`               | Return a custom `ComboboxEmpty`, or `null` to hide the empty state.                                 |
| `renderLoading`             | Replace the default skeleton rows shown when loading with no items.                                 |
| `renderLoadingMore`         | Add non-selectable content below the options while loading another page.                            |
| `scrollThreshold`           | Load earlier using a fraction, percentage, or pixel distance, such as `0.8`, `'80%'`, or `'100px'`. |
| `className`                 | Set the field width; the dropdown follows it.                                                       |
| `disabled` / `aria-invalid` | Disable the field or mark it invalid.                                                               |

Import `ComboboxItem`, `ComboboxChip`, and `ComboboxEmpty` from
`@/components/ui/combobox`. Both loading states suppress the empty message and
pause infinite scrolling.

See the [custom single-select example](app/custom-example.tsx) and
[custom multi-select example](app/custom-multi-example.tsx) for options, selected
values, and chips with avatars and custom loaders.

## Publishing the GitHub registry

The root [registry.json](registry.json) defines the combined `async-comboboxes`
item and the two individual component items. The combined item lists both
component files and one copy of each shared supporting file in its `files` array.
Each item includes its supporting source files so a branch, tag, or commit selects
the whole implementation together. The CLI reads these files directly from GitHub;
no registry server, GitHub Pages site, npm publication, or generated JSON files
are needed. See the [shadcn GitHub registry docs](https://ui.shadcn.com/docs/registry/github).

1. Validate the local source registry:

   ```bash
   bunx --bun shadcn@latest registry validate ./registry.json
   ```

2. Commit and push `registry.json` and its referenced source files to the default
   branch of `hieu-lai/async-combobox`. Keep the repository public for users to
   install without GitHub credentials.
3. Verify the published registry:

   ```bash
   bunx --bun shadcn@latest registry validate hieu-lai/async-combobox
   bunx --bun shadcn@latest list hieu-lai/async-combobox
   bunx --bun shadcn@latest view hieu-lai/async-combobox/async-comboboxes
   ```

Unpinned installs use the repository's default branch. To publish a stable
release, push a Git tag and append it to the install address, for example
`hieu-lai/async-combobox/async-comboboxes#v1.0.0`. The tag must contain the registry
manifest and all its referenced files.
