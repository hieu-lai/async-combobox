This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Component previews

`ComponentPreview` pairs a live example with syntax-highlighted, numbered source
code. The source starts as a faded teaser; **View Code** expands it and exposes
the floating copy and collapse buttons. Use the collapse icon beside the copy
button to hide the code again.

```tsx
import { ComponentPreview } from '@/components/component-preview'

<ComponentPreview code={source} language="tsx" filename="example.tsx">
  <YourExample />
</ComponentPreview>
```

Pass any preview content as `children` and its source as a string in `code`.
`language` defaults to `tsx`; unsupported languages render as plain text.
Use `defaultExpanded` to start open, `highlightedLines={[3, 4]}` to emphasize
source lines (numbered from 1), `previewClassName` to adjust the preview layout,
and `className` for the outer card. Each instance manages its own disclosure
state and accessible source-region ID. The home page reads the example file on
the server so the displayed source stays in sync with the live demo.

### Combobox width

Use `className` to set the `AsyncCombobox` field width. The dropdown follows the
field width automatically.

```tsx
<AsyncCombobox {...props} className="w-full max-w-xs" />
```

Use `w-64` for a fixed width or `w-full` to fill the available width.

### Combobox invalid state

Pass `aria-invalid` to either async combobox to mark its input invalid and show
the destructive border and ring, following the
[shadcn invalid example](https://ui.shadcn.com/docs/components/base/combobox#invalid).
Omit it or pass `false` for the normal state.

```tsx
<AsyncCombobox {...props} aria-invalid={hasError} />
<AsyncMultiCombobox {...multiProps} aria-invalid={hasError} />
```

### Custom single-select content

Pass `renderValue` to `AsyncCombobox` to customize the selected content independently
of the dropdown's `renderItem`. Keep it single-line and non-interactive; use
`truncate` on text inside flex layouts. The field retains its normal height.

```tsx
<AsyncCombobox
  {...props}
  itemToStringLabel={(person) => person.name}
  renderValue={(person) => (
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate">{person.name}</span>
      <span className="text-muted-foreground shrink-0">{person.role}</span>
    </span>
  )}
/>
```

Focusing the field shows its plain label with all text selected, ready to copy or
replace. Focus alone does not emit a search query. Typing a nonempty query searches
without changing the committed selection. Deleting all input text or pressing
Clear removes the selection immediately and leaves an empty, focused input;
Escape does not undo it. Selecting an option commits it and restores rich content.
Escape or leaving the field discards an unfinished search, resets the query, and
restores any remaining selected content. After choosing or cancelling, clicking
or typing starts editing again.

Rich content is hidden from assistive technologies; the native input retains the
plain label from `itemToStringLabel`. Connect a visible external label with `id`,
as with the plain-text variant. Omitting `renderValue` preserves existing behavior.
See `app/custom-value-example.tsx` for a standalone example.

### Custom combobox loading content

`AsyncMultiCombobox` has two loading states:

- `isLoading` marks the first page or a new search as loading, keeping supplied
  options visible. Loading content appears only when there are no supplied items.
- `isLoadingMore` keeps options visible while loading another page.

The combobox always renders the supplied `items` and does not cache results.
Your data hook controls retention: keep passing previous results to preserve
them, or pass an empty array while loading to replace them with loading content.
The demo retains previous results with `usePaginatedQueryWithPreviousData`.

Provide non-selectable loading content using `renderLoading` and
`renderLoadingMore`. By default, `renderLoading` shows skeleton rows and
`renderLoadingMore` renders nothing. Return `null` to hide loading content in
the list. The input still shows its loading spinner.

```tsx
<AsyncMultiCombobox
  {...props}
  isLoading={isLoadingNew}
  isLoadingMore={isLoadingNextPage}
  renderLoading={() => <div role="status">Searching…</div>}
  renderLoadingMore={() => <div role="status">Fetching more results…</div>}
/>
```

Loading content remains visible even if `hasMore` is false during the request.
Both states suppress the empty message and pause infinite scrolling. If both
flags are true, `isLoading` takes precedence. Selected chips remain visible.

### Custom combobox empty state

Use `renderEmpty` to return a custom `ComboboxEmpty` imported from
`@/components/ui/combobox`. Omitting it keeps the default “No items found.”
message. Both loading states suppress the empty state. Return `null` to hide it
entirely.

```tsx
<AsyncMultiCombobox
  {...props}
  renderEmpty={() => <ComboboxEmpty>No matching Pokémon.</ComboboxEmpty>}
/>
```

### Convex integration demo

The home page subscribes to `api.tasks.list` with Convex's `useQuery` hook.
Tasks have `text` and `isCompleted` fields, and the query returns the newest
100 tasks. Update either field in the Convex dashboard to see live updates.

With the existing development deployment configured in `.env.local`, push the
schema and functions, then seed 12 sample tasks:

```bash
bunx convex dev --once
bunx convex run tasks:seed
bunx convex run tasks:list
```

The seed is internal (CLI only) and safe to run again: it skips existing sample
tasks without changing their completion state. Use `bunx convex dev` while
editing backend functions to keep the development deployment in sync.

### Gen 1 Pokémon data

The `pokemon` table stores the 151 original species in their default forms,
using current [PokéAPI](https://pokeapi.co/docs/v2#pokemon) data. Its fields are
`id` (numeric Pokédex number), `name`, `displayName` (first letter capitalized,
with terminal `-m`/`-f` rendered as ` (M)`/` (F)`), `height` (decimetres), `weight`
(hectograms), `image` (`sprites.front_default` URL), `types` and `abilities`
(name arrays, including hidden abilities), and `searchText` (name, types, and
abilities joined with spaces). Convex also adds `_id` and `_creationTime`.
The table has a `by_pokemon_id` index and a `search_searchText` full-text index.

The snapshot is cached in `convex/data/pokemon.json`. To refresh it from PokéAPI
and import it into the configured development deployment:

```bash
node scripts/fetch-pokemon.mjs --refresh
bunx convex dev --once
bunx convex run pokemon:seed
```

Omit `--refresh` to reuse an existing snapshot. The seed is internal (CLI only),
runs atomically, and upserts by Pokédex number: repeated runs preserve document
IDs and skip identical rows. No scheduled refresh is configured.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
