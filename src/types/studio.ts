export type ComponentKind = 'card' | 'button' | 'alert' | 'stat'
export type AccentKey =
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'fuchsia'
  | 'rose'
  | 'orange'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'slate'
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

export const STUDIO_PRESETS: Array<{ label: string; state: Partial<StudioState> }> = [
  {
    label: 'Ocean Blue',
    state: { accent: 'cyan', surface: 'glass', radius: '2xl', shadow: 'glow', padding: 'md' },
  },
  {
    label: 'Emerald Green',
    state: { accent: 'emerald', surface: 'solid', radius: 'xl', shadow: 'glow', padding: 'md' },
  },
  {
    label: 'Royal Indigo',
    state: { accent: 'indigo', surface: 'glass', radius: 'xl', shadow: 'md', padding: 'lg' },
  },
  {
    label: 'Sunset Amber',
    state: { accent: 'amber', surface: 'outline', radius: 'md', shadow: 'glow', padding: 'md' },
  },
  {
    label: 'Ruby Red',
    state: { accent: 'rose', surface: 'glass', radius: '2xl', shadow: 'glow', padding: 'md' },
  },
  {
    label: 'Slate Gray',
    state: { accent: 'slate', surface: 'solid', radius: 'none', shadow: 'none', padding: 'sm' },
  },
]

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
  sky: {
    label: 'Sky',
    hex: '#0ea5e9',
    contrastHex: '#09090b',
    bg: 'bg-sky-500 hover:bg-sky-400 text-zinc-950',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(14,165,233,0.55)]',
    glowRgba: 'rgba(14, 165, 233, 0.55)',
  },
  blue: {
    label: 'Cobalt',
    hex: '#3b82f6',
    contrastHex: '#ffffff',
    bg: 'bg-blue-500 hover:bg-blue-400 text-white',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(59,130,246,0.55)]',
    glowRgba: 'rgba(59, 130, 246, 0.55)',
  },
  indigo: {
    label: 'Indigo',
    hex: '#6366f1',
    contrastHex: '#ffffff',
    bg: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    text: 'text-indigo-400',
    border: 'border-indigo-500/40',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(99,102,241,0.55)]',
    glowRgba: 'rgba(99, 102, 241, 0.55)',
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
  fuchsia: {
    label: 'Fuchsia',
    hex: '#d946ef',
    contrastHex: '#ffffff',
    bg: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
    text: 'text-fuchsia-400',
    border: 'border-fuchsia-500/40',
    badge: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(217,70,239,0.55)]',
    glowRgba: 'rgba(217, 70, 239, 0.55)',
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
  orange: {
    label: 'Orange',
    hex: '#f97316',
    contrastHex: '#09090b',
    bg: 'bg-orange-500 hover:bg-orange-400 text-zinc-950',
    text: 'text-orange-400',
    border: 'border-orange-500/40',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(249,115,22,0.55)]',
    glowRgba: 'rgba(249, 115, 22, 0.55)',
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
  lime: {
    label: 'Lime',
    hex: '#84cc16',
    contrastHex: '#09090b',
    bg: 'bg-lime-400 hover:bg-lime-300 text-zinc-950',
    text: 'text-lime-400',
    border: 'border-lime-500/40',
    badge: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(132,204,22,0.55)]',
    glowRgba: 'rgba(132, 204, 22, 0.55)',
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
  slate: {
    label: 'Titanium',
    hex: '#e2e8f0',
    contrastHex: '#09090b',
    bg: 'bg-slate-200 hover:bg-white text-zinc-950',
    text: 'text-slate-200',
    border: 'border-slate-400/40',
    badge: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
    glow: 'shadow-[0_0_35px_-10px_rgba(226,232,240,0.45)]',
    glowRgba: 'rgba(226, 232, 240, 0.45)',
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
