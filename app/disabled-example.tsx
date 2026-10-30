'use client'

import { AsyncCombobox } from '@/registry/components/async-combobox'

export function DisabledExample() {
  return (
    <AsyncCombobox
      disabled
      className="w-full max-w-xs"
      placeholder="Select a Pokémon"
    />
  )
}
