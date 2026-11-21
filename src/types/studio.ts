export type ComponentKind = 'card' | 'button' | 'alert' | 'stat'
export type AccentKey = 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber'
export type SurfaceMode = 'solid' | 'glass' | 'outline'
export type RadiusKey = 'none' | 'md' | 'xl' | '2xl' | 'full'
export type PaddingKey = 'sm' | 'md' | 'lg'
export type ShadowKey = 'none' | 'md' | 'glow'
export type InteractionState = 'default' | 'loading' | 'disabled'

export interface StudioState {
  component: ComponentKind
  accent: AccentKey
  surface: SurfaceMode
  radius: RadiusKey
  padding: PaddingKey
  shadow: ShadowKey
  interaction: InteractionState
  title: string
  subtitle: string
  ctaLabel: string
  badgeText: string
}

export interface SavedComponent {
  id: string
  name: string
  createdAt: string
  state: StudioState
}

export const DEFAULT_STATE: StudioState = {
  component: 'card',
  accent: 'cyan',
  surface: 'glass',
  radius: '2xl',
  padding: 'md',
  shadow: 'glow',
  interaction: 'default',
  title: 'Deploy at Edge Speed',
  subtitle: 'Ship production React apps with zero-config previews and instant global rollbacks.',
  ctaLabel: 'Launch Project',
  badgeText: 'NEW v2.0',
}

export const ACCENTS: Record<
  AccentKey,
  {
    label: string
    hex: string
    contrastHex: string
    bg: string
    text: string
    border: string
    badge: string
    glow: string
    glowRgba: string
  }
> = {
  cyan: {
    label: 'Cyan',
    hex: '#06b6d4',
    contrastHex: '#09090b',
    bg: 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950',
    text: 'text-cyan-400',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(6,182,212,0.55)]',
    glowRgba: 'rgba(6, 182, 212, 0.55)',
  },
  violet: {
    label: 'Violet',
    hex: '#8b5cf6',
    contrastHex: '#ffffff',
    bg: 'bg-violet-500 hover:bg-violet-400 text-white',
    text: 'text-violet-400',
    border: 'border-violet-500/40',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(139,92,246,0.55)]',
    glowRgba: 'rgba(139, 92, 246, 0.55)',
  },
  emerald: {
    label: 'Emerald',
    hex: '#10b981',
    contrastHex: '#09090b',
    bg: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(16,185,129,0.55)]',
    glowRgba: 'rgba(16, 185, 129, 0.55)',
  },
  rose: {
    label: 'Rose',
    hex: '#f43f5e',
    contrastHex: '#ffffff',
    bg: 'bg-rose-500 hover:bg-rose-400 text-white',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(244,63,94,0.55)]',
    glowRgba: 'rgba(244, 63, 94, 0.55)',
  },
  amber: {
    label: 'Amber',
    hex: '#f59e0b',
    contrastHex: '#09090b',
    bg: 'bg-amber-400 hover:bg-amber-300 text-zinc-950',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(245,158,11,0.55)]',
    glowRgba: 'rgba(245, 158, 11, 0.55)',
  },
}

export const RADIUS_MAP: Record<RadiusKey, string> = {
  none: 'rounded-none',
  md: 'rounded-md',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

export const PADDING_MAP: Record<PaddingKey, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
