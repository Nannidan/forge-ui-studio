import { useEffect, useState } from 'react'
import type { SavedComponent, StudioState } from '../types/studio'

const STORAGE_KEY = 'forge-ui-vault-v1'

export function useComponentVault() {
  const [items, setItems] = useState<SavedComponent[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as SavedComponent[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage quota errors
    }
  }, [items])

  function saveItem(name: string, state: StudioState) {
    const trimmed = name.trim() || `${state.component.toUpperCase()} Preset`
    const entry: SavedComponent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      state,
    }
    setItems((prev) => [entry, ...prev])
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, saveItem, deleteItem }
}
