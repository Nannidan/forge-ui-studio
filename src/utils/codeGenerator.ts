import { ACCENTS, PADDING_MAP, RADIUS_MAP, type StudioState } from '../types/studio'

const RADIUS_CSS: Record<StudioState['radius'], string> = {
  none: '0px',
  md: '0.375rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
}

const PADDING_CSS: Record<StudioState['padding'], string> = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
}

function getSurfaceClasses(state: StudioState): string {
  const accent = ACCENTS[state.accent]
  if (state.surface === 'glass') {
    return `bg-zinc-900/60 backdrop-blur-xl border ${accent.border}`
  }
  if (state.surface === 'outline') {
    return `bg-transparent border-2 ${accent.border}`
  }
  return 'bg-zinc-900 border border-zinc-800'
}

function getShadowClass(state: StudioState): string {
  if (state.shadow === 'none') return ''
  if (state.shadow === 'md') return 'shadow-xl'
  return ACCENTS[state.accent].glow
}

export function generateReactCode(state: StudioState): string {
  const accent = ACCENTS[state.accent]
  const radius =
    state.component === 'button'
      ? RADIUS_MAP[state.radius]
      : RADIUS_MAP[state.radius === 'full' ? '2xl' : state.radius]
  const padding = PADDING_MAP[state.padding]
  const surface = getSurfaceClasses(state)
  const shadow = getShadowClass(state)
  const isLoading = state.interaction === 'loading'
  const isDisabled = state.interaction === 'disabled'
  const stateClasses = isDisabled ? ' opacity-50 cursor-not-allowed' : ''

  if (state.component === 'button') {
    const btnPadding =
      state.padding === 'sm'
        ? 'px-4 py-2 text-xs'
        : state.padding === 'lg'
          ? 'px-7 py-3.5 text-base'
          : 'px-5 py-2.5 text-sm'
    const btnSurface =
      state.surface === 'outline'
        ? `bg-transparent border-2 ${accent.border} ${accent.text} hover:bg-zinc-900`
        : state.surface === 'glass'
          ? `bg-zinc-900/70 backdrop-blur-md border ${accent.border} ${accent.text} hover:bg-zinc-800/80`
          : accent.bg

    return `export function ForgeButton() {
  return (
    <button
      type="button"${isDisabled || isLoading ? '\n      disabled' : ''}${isLoading ? '\n      aria-busy="true"' : ''}${isDisabled ? '\n      aria-disabled="true"' : ''}
      className="inline-flex items-center gap-2 font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${btnPadding} ${radius} ${btnSurface} ${shadow}"
    >
      ${
        isLoading
          ? `<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      <span>Processing...</span>`
          : `<span>${state.ctaLabel}</span>
      <span aria-hidden="true">→</span>`
      }
    </button>
  )
}`
  }

  if (state.component === 'alert') {
    return `export function ForgeAlert() {
  return (
    <div
      role="status"${isLoading ? '\n      aria-busy="true"' : ''}${isDisabled ? '\n      aria-disabled="true"' : ''}
      className="flex items-start gap-3.5 ${padding} ${radius} ${surface} ${shadow}${stateClasses}"
    >
      ${
        isLoading
          ? `<div className="h-3 w-3 mt-1 animate-pulse rounded-full bg-zinc-700" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-zinc-700" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800" />
      </div>`
          : `<span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${accent.bg.split(' ')[0]}" />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">${state.title}</h3>
          <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${accent.badge}">
            ${state.badgeText}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">
          ${state.subtitle}
        </p>
      </div>`
      }
    </div>
  )
}`
  }

  if (state.component === 'stat') {
    return `export function ForgeStatTile() {
  return (
    <div${isLoading ? ' aria-busy="true"' : ''}${isDisabled ? ' aria-disabled="true"' : ''}
      className="w-full max-w-xs ${padding} ${radius} ${surface} ${shadow}${stateClasses}"
    >
      ${
        isLoading
          ? `<div className="space-y-3">
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-700" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-800" />
      </div>`
          : `<div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
          ${state.title}
        </span>
        <span className="rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${accent.badge}">
          ${state.badgeText}
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-100">
        99.98%
      </p>
      <p className="mt-1.5 text-xs text-zinc-400">
        ${state.subtitle}
      </p>`
      }
    </div>
  )
}`
  }

  return `export function ForgeCard() {
  return (
    <div${isLoading ? ' aria-busy="true"' : ''}${isDisabled ? ' aria-disabled="true"' : ''}
      className="w-full max-w-sm ${padding} ${radius} ${surface} ${shadow}${stateClasses}"
    >
      ${
        isLoading
          ? `<div className="space-y-3">
        <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-800" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-700" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
        <div className="mt-5 h-10 w-36 animate-pulse rounded-xl bg-zinc-700" />
      </div>`
          : `<span className="inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${accent.badge}">
        ${state.badgeText}
      </span>
      <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-100">
        ${state.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        ${state.subtitle}
      </p>
      <button
        type="button"${isDisabled ? '\n        disabled' : ''}
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 ${accent.bg}"
      >
        <span>${state.ctaLabel}</span>
        <span aria-hidden="true">→</span>
      </button>`
      }
    </div>
  )
}`
}

export function generateCssTokens(state: StudioState): string {
  const accent = ACCENTS[state.accent]
  return `/* Tailwind CSS v4 Design Tokens — Generated by FORGE // UI */
@import "tailwindcss";

@theme inline {
  --color-forge-accent: ${accent.hex};
  --color-forge-accent-contrast: ${accent.contrastHex};
  --color-forge-surface: ${state.surface === 'outline' ? 'transparent' : state.surface === 'glass' ? 'rgba(24, 24, 27, 0.65)' : '#18181b'};
  --color-forge-border: ${state.surface === 'solid' ? '#27272a' : accent.glowRgba};

  --radius-forge: ${RADIUS_CSS[state.radius]};
  --spacing-forge: ${PADDING_CSS[state.padding]};
  --shadow-forge: ${
    state.shadow === 'none'
      ? 'none'
      : state.shadow === 'md'
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.35)'
        : `0 0 35px -10px ${accent.glowRgba}`
  };
}`
}

export function generateAiPrompt(state: StudioState): string {
  const accent = ACCENTS[state.accent]
  return `Build a responsive, accessible React + TypeScript + Tailwind CSS v4 "${state.component.toUpperCase()}" component with the following design tokens:

- Visual Style: ${state.surface} surface (${state.surface === 'glass' ? 'translucent dark glassmorphism with backdrop-blur-xl' : state.surface === 'outline' ? 'transparent background with 2px accent border' : 'solid dark zinc-900 card'})
- Accent Color: ${accent.label} (${accent.hex})
- Border Radius: ${RADIUS_MAP[state.radius]}
- Padding Scale: ${state.padding.toUpperCase()} (${PADDING_MAP[state.padding]})
- Elevation / Shadow: ${state.shadow === 'glow' ? `soft ${accent.label.toLowerCase()} neon outer glow` : state.shadow}
- Interactive State: ${state.interaction.toUpperCase()} (${state.interaction === 'loading' ? 'include skeleton/spinner and aria-busy="true"' : state.interaction === 'disabled' ? 'include disabled styling and aria-disabled="true"' : 'standard interactive hover/focus/active states'})
- Copy Content:
  - Badge: "${state.badgeText}"
  - Title: "${state.title}"
  - Subtitle: "${state.subtitle}"
  - CTA Label: "${state.ctaLabel}"

Requirements:
1. Use semantic HTML, WCAG AA contrast, and keyboard focus-visible rings.
2. Support Default, Loading, and Disabled states cleanly.
3. Keep the component self-contained with Tailwind CSS v4 utilities.`
}
