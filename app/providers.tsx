'use client'

import { ConvexQueryClient } from '@convex-dev/react-query'
import {
  QueryClient,
  QueryClientProvider,
  environmentManager,
} from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

function makeClients() {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  const convexQueryClient = new ConvexQueryClient(convex)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })

  convexQueryClient.connect(queryClient)

  return { convex, queryClient }
}

let browserClients: ReturnType<typeof makeClients> | undefined

function getClients() {
  if (environmentManager.isServer()) {
    return makeClients()
  }

  return (browserClients ??= makeClients())
}

export function Providers({ children }: { children: ReactNode }) {
  const { convex, queryClient } = getClients()

  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </QueryClientProvider>
    </ConvexProvider>
  )
}
