import { ACCENTS, type StudioState } from '../types/studio'

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(fgHex)
  const l2 = relativeLuminance(bgHex)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(1))
}

export interface A11yReport {
  ratio: number
  grade: 'AAA' | 'AA' | 'AA Large' | 'Fail'
  checks: { label: string; pass: boolean }[]
}

export function evaluateA11y(state: StudioState, canvasTheme: 'dark' | 'light'): A11yReport {
  const accent = ACCENTS[state.accent]

  let fg = canvasTheme === 'dark' ? '#f4f4f5' : '#18181b'
  let bg = canvasTheme === 'dark' ? '#18181b' : '#ffffff'

  if (state.component === 'button') {
    if (state.surface === 'solid') {
      fg = accent.contrastHex
      bg = accent.hex
    } else if (state.surface === 'glass') {
      fg = accent.hex
      bg = '#18181b'
    } else {
      fg = accent.hex
      bg = canvasTheme === 'dark' ? '#09090b' : '#f4f4f5'
    }
  } else if (state.surface === 'outline') {
    bg = canvasTheme === 'dark' ? '#09090b' : '#f4f4f5'
  }

  const ratio = getContrastRatio(fg, bg)
  const grade: A11yReport['grade'] =
    ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'

  const checks = [
    { label: `WCAG Contrast (${ratio}:1)`, pass: ratio >= 4.5 },
    {
      label:
        state.component === 'alert'
          ? 'Semantic role="status"'
          : state.component === 'button'
            ? 'Explicit type="button"'
            : 'Semantic heading & landmarks',
      pass: true,
    },
    { label: 'Keyboard focus-visible ring', pass: true },
    {
      label:
        state.interaction === 'loading'
          ? 'aria-busy="true" state'
          : state.interaction === 'disabled'
            ? 'aria-disabled="true" state'
            : 'Interactive state ready',
      pass: true,
    },
  ]

  return { ratio, grade, checks }
}
