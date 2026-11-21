import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bell, Monitor, Moon, Smartphone, Sun, Tablet, TrendingUp } from 'lucide-react'
import { ACCENTS, PADDING_MAP, RADIUS_MAP, type StudioState } from '../types/studio'

interface LivePreviewProps {
  state: StudioState
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export function LivePreview({ state }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [canvasTheme, setCanvasTheme] = useState<'dark' | 'light'>('dark')

  const accent = ACCENTS[state.accent]
  const radius =
    state.component === 'button'
      ? RADIUS_MAP[state.radius]
      : RADIUS_MAP[state.radius === 'full' ? '2xl' : state.radius]
  const padding = PADDING_MAP[state.padding]

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

  const stageWidth =
    viewport === 'mobile'
      ? 'max-w-[300px]'
      : viewport === 'tablet'
        ? 'max-w-[520px]'
        : 'max-w-full'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      {/* Compact Canvas Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/70 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-1 font-mono text-[11px] font-medium text-zinc-400">
            {state.component.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
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
          className={`flex w-full items-center justify-center ${stageWidth}`}
        >
          {state.component === 'button' && (
            <button
              type="button"
              className={`inline-flex items-center gap-2 font-semibold transition-all active:scale-95 ${
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
              <span>{state.ctaLabel || 'Launch Project'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {state.component === 'alert' && (
            <div
              role="status"
              className={`flex w-full max-w-md items-start gap-3 ${padding} ${radius} ${surfaceClass} ${shadowClass}`}
            >
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
            </div>
          )}

          {state.component === 'stat' && (
            <div className={`w-full max-w-xs ${padding} ${radius} ${surfaceClass} ${shadowClass}`}>
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
            </div>
          )}

          {state.component === 'card' && (
            <div className={`w-full max-w-sm ${padding} ${radius} ${surfaceClass} ${shadowClass}`}>
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
                className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 sm:text-sm ${accent.bg}`}
              >
                <span>{state.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
