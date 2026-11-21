import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Plus, Trash2, X } from 'lucide-react'
import { ACCENTS, type SavedComponent, type StudioState } from '../types/studio'

interface VaultDrawerProps {
  open: boolean
  onClose: () => void
  items: SavedComponent[]
  currentState: StudioState
  onSave: (name: string, state: StudioState) => void
  onLoad: (state: StudioState) => void
  onDelete: (id: string) => void
}

export function VaultDrawer({
  open,
  onClose,
  items,
  currentState,
  onSave,
  onLoad,
  onDelete,
}: VaultDrawerProps) {
  const [presetName, setPresetName] = useState('')

  function handleSave(e: FormEvent) {
    e.preventDefault()
    onSave(presetName, currentState)
    setPresetName('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Saved component vault"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-sm flex-col border-l border-zinc-800 bg-zinc-950 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-cyan-400" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
                  Component Vault ({items.length})
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close vault"
                onClick={onClose}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Save Current State Form */}
            <form onSubmit={handleSave} className="mt-4 flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder={`Name this ${currentState.component}...`}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
              >
                <Plus className="h-3.5 w-3.5" />
                Save
              </button>
            </form>

            {/* Saved Items List */}
            <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center">
                  <p className="text-xs font-medium text-zinc-400">No saved components yet.</p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Name your current design above to store it in localStorage.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const accent = ACCENTS[item.state.accent]
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onLoad(item.state)
                          onClose()
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                      >
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: accent.hex }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-zinc-100">
                            {item.name}
                          </p>
                          <p className="font-mono text-[10px] uppercase text-zinc-400">
                            {item.state.component} · {item.state.surface} · {item.createdAt}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => onDelete(item.id)}
                        className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
