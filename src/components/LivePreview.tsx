import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  Loader2,
  Monitor,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Tablet,
  TrendingUp,
} from 'lucide-react'
import {
  ACCENTS,
  PADDING_MAP,
  RADIUS_MAP,
  type InteractionState,
  type StudioState,
} from '../types/studio'
import { evaluateA11y } from '../utils/a11y'

interface LivePreviewProps {
  state: StudioState
  onInteractionChange: (next: InteractionState) => void
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile'
const INTERACTION_STATES: InteractionState[] = ['default', 'loading', 'disabled']

export function LivePreview({ state, onInteractionChange }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [canvasTheme, setCanvasTheme] = useState<'dark' | 'light'>('dark')
  const [showA11yDetails, setShowA11yDetails] = useState(false)

  const a11y = useMemo(() => evaluateA11y(state, canvasTheme), [state, canvasTheme])

  const accent = ACCENTS[state.accent]
  const radius =
    state.component === 'button'
      ? RADIUS_MAP[state.radius]
      : RADIUS_MAP[state.radius === 'full' ? '2xl' : state.radius]
  const padding = PADDING_MAP[state.padding]

  const isLoading = state.interaction === 'loading'
  const isDisabled = state.interaction === 'disabled'

  const surfaceClass =
    state.surface === 'glass'
      ? canvasTheme === 'dark'
        ? `bg-zinc-900/65 backdrop-blur-xl border ${accent.border}`
        : `bg-white/75 backdrop-blur-xl border ${accent.border}`
      : state.surface === 'outline'
        ? `bg-transparent border-2 ${accent.border}`
        : canvasTheme === 'dark'
          ? 'bg-zinc-900 border border-zinc-800'
          : 'bg-white border border-zinc-200'

  const shadowClass =
    state.shadow === 'none' ? '' : state.shadow === 'md' ? 'shadow-xl' : accent.glow

  const titleColor = canvasTheme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
  const subColor = canvasTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
  const skelBg = canvasTheme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-300'

  const stageWidth =
    viewport === 'mobile'
      ? 'max-w-[300px]'
      : viewport === 'tablet'
        ? 'max-w-[520px]'
        : 'max-w-full'

  const a11yPass = a11y.grade === 'AAA' || a11y.grade === 'AA'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      {/* Compact Canvas Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/70 px-3 py-2">
        {/* Left: State Simulator Pills */}
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Component interaction state"
            className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5"
          >
            {INTERACTION_STATES.map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={state.interaction === mode}
                onClick={() => onInteractionChange(mode)}
                className={`rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase transition-colors ${
                  state.interaction === mode
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live A11y Contrast Badge + Viewport + Theme */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowA11yDetails((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-semibold transition-colors ${
              a11yPass
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            {a11yPass ? (
              <ShieldCheck className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            <span>
              {a11y.grade} · {a11y.ratio}:1
            </span>
          </button>

          <div className="hidden rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 sm:flex">
            <button
              type="button"
              aria-label="Desktop viewport"
              onClick={() => setViewport('desktop')}
              className={`rounded-md p-1 transition-colors ${
                viewport === 'desktop' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Tablet viewport"
              onClick={() => setViewport('tablet')}
              className={`rounded-md p-1 transition-colors ${
                viewport === 'tablet' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Mobile viewport"
              onClick={() => setViewport('mobile')}
              className={`rounded-md p-1 transition-colors ${
                viewport === 'mobile' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle canvas background"
            onClick={() => setCanvasTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {canvasTheme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable A11y Audit Strip */}
      {showA11yDetails && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2 font-mono text-[11px]">
          {a11y.checks.map((chk) => (
            <span
              key={chk.label}
              className={`inline-flex items-center gap-1 ${
                chk.pass ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {chk.pass ? (
                <Check className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              {chk.label}
            </span>
          ))}
        </div>
      )}

      {/* Stretchy Dotted Stage */}
      <div
        className={`flex flex-1 min-h-[220px] items-center justify-center p-4 transition-colors sm:min-h-[280px] sm:p-8 ${
          canvasTheme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'
        }`}
        style={{
          backgroundImage:
            canvasTheme === 'dark'
              ? 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)'
              : 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={`flex w-full items-center justify-center ${stageWidth} ${
            isDisabled ? 'opacity-50 grayscale-[25%]' : ''
          }`}
        >
          {state.component === 'button' && (
            <button
              type="button"
              disabled={isDisabled || isLoading}
              aria-busy={isLoading}
              aria-disabled={isDisabled}
              className={`inline-flex items-center gap-2 font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed ${
                state.padding === 'sm'
                  ? 'px-4 py-2 text-xs'
                  : state.padding === 'lg'
                    ? 'px-7 py-3.5 text-base'
                    : 'px-5 py-2.5 text-sm'
              } ${radius} ${
                state.surface === 'outline'
                  ? `bg-transparent border-2 ${accent.border} ${accent.text}`
                  : state.surface === 'glass'
                    ? `bg-zinc-900/70 backdrop-blur-md border ${accent.border} ${accent.text}`
                    : accent.bg
              } ${shadowClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{state.ctaLabel || 'Launch Project'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}

          {state.component === 'alert' && (
            <div
              role="status"
              aria-busy={isLoading}
              aria-disabled={isDisabled}
              className={`flex w-full max-w-md items-start gap-3 ${padding} ${radius} ${surfaceClass} ${shadowClass}`}
            >
              {isLoading ? (
                <div className="flex w-full items-start gap-3">
                  <div className={`mt-1 h-4 w-4 shrink-0 animate-pulse rounded-full ${skelBg}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-3.5 w-1/3 animate-pulse rounded ${skelBg}`} />
                    <div className={`h-3 w-5/6 animate-pulse rounded ${skelBg}`} />
                  </div>
                </div>
              ) : (
                <>
                  <Bell className={`mt-0.5 h-4 w-4 shrink-0 ${accent.text}`} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm font-semibold ${titleColor}`}>{state.title}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${accent.badge}`}
                      >
                        {state.badgeText}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${subColor}`}>{state.subtitle}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {state.component === 'stat' && (
            <div
              aria-busy={isLoading}
              aria-disabled={isDisabled}
              className={`w-full max-w-xs ${padding} ${radius} ${surfaceClass} ${shadowClass}`}
            >
              {isLoading ? (
                <div className="space-y-3">
                  <div className={`h-3 w-1/2 animate-pulse rounded ${skelBg}`} />
                  <div className={`h-8 w-2/3 animate-pulse rounded ${skelBg}`} />
                  <div className={`h-3 w-full animate-pulse rounded ${skelBg}`} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate font-mono text-xs uppercase tracking-wider ${subColor}`}>
                      {state.title}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${accent.badge}`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {state.badgeText}
                    </span>
                  </div>
                  <p className={`mt-3 text-3xl font-extrabold tracking-tight ${titleColor}`}>99.98%</p>
                  <p className={`mt-1.5 text-xs ${subColor}`}>{state.subtitle}</p>
                </>
              )}
            </div>
          )}

          {state.component === 'card' && (
            <div
              aria-busy={isLoading}
              aria-disabled={isDisabled}
              className={`w-full max-w-sm ${padding} ${radius} ${surfaceClass} ${shadowClass}`}
            >
              {isLoading ? (
                <div className="space-y-3">
                  <div className={`h-5 w-20 animate-pulse rounded-full ${skelBg}`} />
                  <div className={`h-6 w-3/4 animate-pulse rounded ${skelBg}`} />
                  <div className={`h-4 w-full animate-pulse rounded ${skelBg}`} />
                  <div className={`mt-5 h-9 w-36 animate-pulse rounded-xl ${skelBg}`} />
                </div>
              ) : (
                <>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${accent.badge}`}
                  >
                    {state.badgeText}
                  </span>
                  <h3 className={`mt-3 text-lg font-bold tracking-tight sm:text-xl ${titleColor}`}>
                    {state.title}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed sm:text-sm ${subColor}`}>
                    {state.subtitle}
                  </p>
                  <button
                    type="button"
                    disabled={isDisabled}
                    className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 disabled:cursor-not-allowed sm:text-sm ${accent.bg}`}
                  >
                    <span>{state.ctaLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
