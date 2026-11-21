import { useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import {
  ArrowLeft,
  Bookmark,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Layers,
  Palette,
  Redo2,
  RotateCcw,
  Shuffle,
  Sliders,
  Sparkles,
  Undo2,
  Wand2,
} from 'lucide-react'
import {
  ACCENTS,
  DEFAULT_STATE,
  type AccentKey,
  type ComponentKind,
  type PaddingKey,
  type RadiusKey,
  type ShadowKey,
  type StudioState,
  type SurfaceMode,
} from './types/studio'
import {
  generateAiPrompt,
  generateCssTokens,
  generateReactCode,
} from './utils/codeGenerator'
import { useHistoryState } from './hooks/useHistoryState'
import { useComponentVault } from './hooks/useComponentVault'
import { LivePreview } from './components/LivePreview'
import { VaultDrawer } from './components/VaultDrawer'

const COMPONENTS: { id: ComponentKind; label: string }[] = [
  { id: 'card', label: 'Card' },
  { id: 'button', label: 'Button' },
  { id: 'alert', label: 'Alert' },
  { id: 'stat', label: 'Stat Tile' },
]

const SURFACES: SurfaceMode[] = ['solid', 'glass', 'outline']
const RADII: RadiusKey[] = ['none', 'md', 'xl', '2xl', 'full']
const PADDINGS: PaddingKey[] = ['sm', 'md', 'lg']
const SHADOWS: ShadowKey[] = ['none', 'md', 'glow']

export default function App() {
  const { state, set: setState, undo, redo, reset, canUndo, canRedo } =
    useHistoryState<StudioState>(DEFAULT_STATE)
  const { items: vaultItems, saveItem, deleteItem } = useComponentVault()

  const [vaultOpen, setVaultOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'tokens' | 'content' | 'export'>('tokens')
  const [exportTab, setExportTab] = useState<'code' | 'css' | 'prompt'>('code')
  const [copied, setCopied] = useState(false)

  const reactCode = useMemo(() => generateReactCode(state), [state])
  const cssTokens = useMemo(() => generateCssTokens(state), [state])
  const aiPrompt = useMemo(() => generateAiPrompt(state), [state])

  const activeOutput =
    exportTab === 'code' ? reactCode : exportTab === 'css' ? cssTokens : aiPrompt

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  function update<K extends keyof StudioState>(key: K, value: StudioState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function randomizeTokens() {
    const accentKeys = Object.keys(ACCENTS) as AccentKey[]
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
    setState((prev) => ({
      ...prev,
      accent: pick(accentKeys),
      surface: pick(SURFACES),
      radius: pick(RADII),
      padding: pick(PADDINGS),
      shadow: pick(SHADOWS),
    }))
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(activeOutput)
    } catch {
      // ignore if clipboard blocked
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function downloadOutput() {
    const ext = exportTab === 'code' ? 'tsx' : exportTab === 'css' ? 'css' : 'txt'
    const filename = `forge-${state.component}.${ext}`
    const blob = new Blob([activeOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const tokensSection = (
    <div className="space-y-4">
      <div>
        <span className="block font-mono text-[11px] text-zinc-400">ACCENT</span>
        <div className="mt-2 grid grid-cols-5 gap-1.5 sm:flex sm:flex-wrap">
          {(Object.keys(ACCENTS) as AccentKey[]).map((key) => {
            const item = ACCENTS[key]
            const active = state.accent === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => update('accent', key)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border-zinc-200 bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.hex }} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <span className="block font-mono text-[11px] text-zinc-400">SURFACE</span>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {SURFACES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update('surface', s)}
              className={`rounded-lg border py-1.5 text-xs font-semibold capitalize transition-colors ${
                state.surface === s
                  ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block font-mono text-[11px] text-zinc-400">RADIUS</span>
        <div className="mt-1.5 grid grid-cols-5 gap-1.5">
          {RADII.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update('radius', r)}
              className={`rounded-lg border py-1.5 font-mono text-[11px] uppercase transition-colors ${
                state.radius === r
                  ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block font-mono text-[11px] text-zinc-400">PADDING</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {PADDINGS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update('padding', p)}
                className={`rounded-lg border py-1.5 font-mono text-[11px] uppercase transition-colors ${
                  state.padding === p
                    ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block font-mono text-[11px] text-zinc-400">SHADOW</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {SHADOWS.map((sh) => (
              <button
                key={sh}
                type="button"
                onClick={() => update('shadow', sh)}
                className={`rounded-lg border py-1.5 font-mono text-[11px] uppercase transition-colors ${
                  state.shadow === sh
                    ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sh}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const contentSection = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <div>
        <label htmlFor="badge-input" className="block font-mono text-[11px] text-zinc-400">
          BADGE
        </label>
        <input
          id="badge-input"
          type="text"
          value={state.badgeText}
          onChange={(e) => update('badgeText', e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="title-input" className="block font-mono text-[11px] text-zinc-400">
          TITLE
        </label>
        <input
          id="title-input"
          type="text"
          value={state.title}
          onChange={(e) => update('title', e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="sub-input" className="block font-mono text-[11px] text-zinc-400">
          DESCRIPTION
        </label>
        <textarea
          id="sub-input"
          rows={2}
          value={state.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="cta-input" className="block font-mono text-[11px] text-zinc-400">
          BUTTON LABEL
        </label>
        <input
          id="cta-input"
          type="text"
          value={state.ctaLabel}
          onChange={(e) => update('ctaLabel', e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-cyan-500 focus:outline-none"
        />
      </div>
    </div>
  )

  const exportPanel = (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
        <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
          <button
            type="button"
            onClick={() => setExportTab('code')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              exportTab === 'code'
                ? 'bg-cyan-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            JSX
          </button>
          <button
            type="button"
            onClick={() => setExportTab('css')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              exportTab === 'css'
                ? 'bg-cyan-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            @theme
          </button>
          <button
            type="button"
            onClick={() => setExportTab('prompt')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              exportTab === 'prompt'
                ? 'bg-cyan-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            AI Prompt
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={downloadOutput}
            aria-label="Download file"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-500/60 hover:text-zinc-100"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            type="button"
            onClick={() => void copyOutput()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-100 transition-colors hover:border-cyan-500/60"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-cyan-400" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <pre className="flex-1 overflow-auto p-3.5 font-mono text-xs leading-relaxed text-zinc-300">
        <code>{activeOutput}</code>
      </pre>
    </div>
  )

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100 lg:h-dvh lg:overflow-hidden">
        {/* Compact Top Bar */}
        <header className="sticky top-0 z-30 shrink-0 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5">
            <div className="flex items-center gap-2">
              <a
                href="https://portfolio-hub-44jc.vercel.app/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-500/50 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
                <span>Portfolio</span>
              </a>
              <div className="h-5 w-px bg-zinc-800" />
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono text-sm font-bold tracking-wider text-zinc-100">
                FORGE // UI
              </span>
            </div>

            {/* Desktop Component Switcher */}
            <div className="hidden gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 md:flex">
              {COMPONENTS.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => update('component', comp.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    state.component === comp.id
                      ? 'bg-cyan-500 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {comp.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Undo"
                  title="Undo (Ctrl+Z)"
                  className="rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  aria-label="Redo"
                  title="Redo (Ctrl+Shift+Z)"
                  className="rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setVaultOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Vault</span>
                <span className="rounded bg-cyan-500/20 px-1 font-mono text-[10px]">
                  {vaultItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={randomizeTokens}
                aria-label="Randomize tokens"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-cyan-500/50"
              >
                <Shuffle className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Randomize</span>
              </button>

              <button
                type="button"
                onClick={() => reset(DEFAULT_STATE)}
                aria-label="Reset studio"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <a
                href="https://github.com/Nannidan/forge-ui-studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                title="View Source on GitHub"
                className="hidden items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-300 sm:inline-flex"
              >
                <span>Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Mobile Component Strip */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-zinc-800/70 px-3 py-2 md:hidden">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => update('component', comp.id)}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  state.component === comp.id
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex flex-1 flex-col gap-3 p-3 sm:p-4 lg:min-h-0 lg:flex-row lg:gap-4">
          <aside className="hidden w-80 shrink-0 flex-col gap-5 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 xl:w-96 lg:flex">
            <div>
              <div className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Design Tokens
                </h2>
              </div>
              {tokensSection}
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Content
                </h2>
              </div>
              {contentSection}
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col gap-3 lg:min-h-0 2xl:grid 2xl:grid-cols-12">
            <div className="lg:min-h-0 lg:flex-1 2xl:col-span-7">
              <LivePreview
                state={state}
                onInteractionChange={(next) => update('interaction', next)}
              />
            </div>

            <div className="hidden lg:block lg:h-64 lg:shrink-0 2xl:col-span-5 2xl:h-full">
              {exportPanel}
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => setMobileTab('tokens')}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    mobileTab === 'tokens' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  Tokens
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('content')}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    mobileTab === 'content' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('export')}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                    mobileTab === 'export' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Code
                </button>
              </div>

              {mobileTab === 'tokens' && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  {tokensSection}
                </div>
              )}
              {mobileTab === 'content' && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                  {contentSection}
                </div>
              )}
              {mobileTab === 'export' && <div className="h-72">{exportPanel}</div>}
            </div>
          </section>
        </main>

        <VaultDrawer
          open={vaultOpen}
          onClose={() => setVaultOpen(false)}
          items={vaultItems}
          currentState={state}
          onSave={saveItem}
          onLoad={(loaded) => setState(loaded)}
          onDelete={deleteItem}
        />
      </div>
    </MotionConfig>
  )
}
