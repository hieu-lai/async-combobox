import {
  AnvilIcon,
  BrainIcon,
  BugIcon,
  CircleIcon,
  DropletsIcon,
  FeatherIcon,
  FlameIcon,
  GemIcon,
  GhostIcon,
  HandFistIcon,
  LeafIcon,
  MountainIcon,
  SkullIcon,
  SnowflakeIcon,
  SparklesIcon,
  WormIcon,
  ZapIcon,
  type LucideIcon,
} from 'lucide-react'

// Types present in the pokemon table's cached dataset (convex/data/pokemon.json).
// Scarlet & Violet colors:
// https://bulbapedia.bulbagarden.net/wiki/Help:Color_templates#Video_game_types
export const pokemonTypeMap = {
  bug: { color: '#91A119', icon: BugIcon },
  dragon: { color: '#5060E1', icon: WormIcon },
  electric: { color: '#FAC000', icon: ZapIcon },
  fairy: { color: '#EF70EF', icon: SparklesIcon },
  fighting: { color: '#FF8000', icon: HandFistIcon },
  fire: { color: '#E62829', icon: FlameIcon },
  flying: { color: '#81B9EF', icon: FeatherIcon },
  ghost: { color: '#704170', icon: GhostIcon },
  grass: { color: '#3FA129', icon: LeafIcon },
  ground: { color: '#915121', icon: MountainIcon },
  ice: { color: '#3DCEF3', icon: SnowflakeIcon },
  normal: { color: '#9FA19F', icon: CircleIcon },
  poison: { color: '#9141CB', icon: SkullIcon },
  psychic: { color: '#EF4179', icon: BrainIcon },
  rock: { color: '#AFA981', icon: GemIcon },
  steel: { color: '#60A1B8', icon: AnvilIcon },
  water: { color: '#2980EF', icon: DropletsIcon },
} as const satisfies Record<string, { color: `#${string}`; icon: LucideIcon }>

export type PokemonType = keyof typeof pokemonTypeMap
