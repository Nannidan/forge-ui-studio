import { ACCENTS, PADDING_MAP, RADIUS_MAP, type StudioState } from '../types/studio'

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
  const radius = state.component === 'button' ? RADIUS_MAP[state.radius] : RADIUS_MAP[state.radius === 'full' ? '2xl' : state.radius]
  const padding = PADDING_MAP[state.padding]
  const surface = getSurfaceClasses(state)
  const shadow = getShadowClass(state)

  if (state.component === 'button') {
    const btnPadding =
      state.padding === 'sm' ? 'px-4 py-2 text-xs' : state.padding === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm'
    const btnSurface =
      state.surface === 'outline'
        ? `bg-transparent border-2 ${accent.border} ${accent.text} hover:bg-zinc-900`
        : state.surface === 'glass'
          ? `bg-zinc-900/70 backdrop-blur-md border ${accent.border} ${accent.text} hover:bg-zinc-800/80`
          : accent.bg

    return `export function ForgeButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 font-semibold transition-all active:scale-95 ${btnPadding} ${radius} ${btnSurface} ${shadow}"
    >
      <span>${state.ctaLabel}</span>
      <span aria-hidden="true">→</span>
    </button>
  )
}`
  }

  if (state.component === 'alert') {
    return `export function ForgeAlert() {
  return (
    <div
      role="status"
      className="flex items-start gap-3.5 ${padding} ${radius} ${surface} ${shadow}"
    >
      <span className="mt-0.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${accent.bg.split(' ')[0]}" />
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
      </div>
    </div>
  )
}`
  }

  if (state.component === 'stat') {
    return `export function ForgeStatTile() {
  return (
    <div className="w-full max-w-xs ${padding} ${radius} ${surface} ${shadow}">
      <div className="flex items-center justify-between">
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
      </p>
    </div>
  )
}`
  }

  return `export function ForgeCard() {
  return (
    <div className="w-full max-w-sm ${padding} ${radius} ${surface} ${shadow}">
      <span className="inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${accent.badge}">
        ${state.badgeText}
      </span>
      <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-100">
        ${state.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        ${state.subtitle}
      </p>
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${accent.bg}"
      >
        <span>${state.ctaLabel}</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )
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
- Copy Content:
  - Badge: "${state.badgeText}"
  - Title: "${state.title}"
  - Subtitle: "${state.subtitle}"
  - CTA Label: "${state.ctaLabel}"

Requirements:
1. Use semantic HTML and proper ARIA attributes.
2. Include subtle hover and active press states.
3. Keep the component self-contained with zero external CSS files.`
}
