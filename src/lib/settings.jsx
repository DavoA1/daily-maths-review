import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = {
  dark: {
    name: 'Dark',
    bg: '#08090d', surface: '#11131a', surface2: '#181b24', surface3: '#1e2230',
    border: '#252836', border2: '#2e3347',
    accent: '#f0e44a', blue: '#4ac8f0', red: '#f04a6b', purple: '#a04af0',
    green: '#4af0a0', orange: '#f0944a',
    text: '#dde1ed', textMuted: '#5a6080', textDim: '#8890a8',
  },
  light: {
    name: 'Light',
    bg: '#f8f9fc', surface: '#ffffff', surface2: '#f0f2f7', surface3: '#e8ecf5',
    border: '#dde3ef', border2: '#c8d0e0',
    accent: '#d4a000', blue: '#0080c0', red: '#d03050', purple: '#7030c0',
    green: '#208040', orange: '#c05010',
    text: '#1a1d2e', textMuted: '#6070a0', textDim: '#8090b0',
  },
  highContrast: {
    name: 'High Contrast',
    bg: '#000000', surface: '#111111', surface2: '#1a1a1a', surface3: '#222222',
    border: '#444444', border2: '#555555',
    accent: '#ffff00', blue: '#00aaff', red: '#ff4444', purple: '#cc44ff',
    green: '#00ff88', orange: '#ff8800',
    text: '#ffffff', textMuted: '#aaaaaa', textDim: '#cccccc',
  },
  classroom: {
    name: 'Classroom (Blue)',
    bg: '#0a1628', surface: '#0f2040', surface2: '#162850', surface3: '#1c3060',
    border: '#1e3a6e', border2: '#284a80',
    accent: '#ffcc00', blue: '#60c0ff', red: '#ff6060', purple: '#c080ff',
    green: '#60ffaa', orange: '#ffaa40',
    text: '#e8f0ff', textMuted: '#6888b0', textDim: '#8aaad0',
  }
}

const FONT_SIZES = {
  small:  { base: '13px', question: '14px', heading: '22px', present: '16px' },
  medium: { base: '14px', question: '16px', heading: '26px', present: '20px' },
  large:  { base: '15px', question: '19px', heading: '30px', present: '24px' },
  xl:     { base: '16px', question: '22px', heading: '34px', present: '28px' },
}

const FONTS = {
  default: { body: "'Figtree', sans-serif", mono: "'JetBrains Mono', monospace", display: "'Syne', sans-serif" },
  dyslexia: { body: "'OpenDyslexic', 'Figtree', sans-serif", mono: "'OpenDyslexic Mono', monospace", display: "'OpenDyslexic', sans-serif" },
  serif: { body: "'Georgia', serif", mono: "'Courier New', monospace", display: "'Georgia', serif" },
}

const SettingsContext = createContext(null)

const DEFAULT = { theme: 'dark', fontSize: 'medium', font: 'default', accentOverride: null }

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem('dmr_settings') || '{}') } }
    catch { return DEFAULT }
  })

  useEffect(() => {
    localStorage.setItem('dmr_settings', JSON.stringify(settings))
    applyTheme(settings)
  }, [settings])

  function applyTheme(s) {
    const t = THEMES[s.theme] || THEMES.dark
    const fs = FONT_SIZES[s.fontSize] || FONT_SIZES.medium
    const f = FONTS[s.font] || FONTS.default
    const root = document.documentElement
    root.style.setProperty('--bg', t.bg)
    root.style.setProperty('--s1', t.surface)
    root.style.setProperty('--s2', t.surface2)
    root.style.setProperty('--s3', t.surface3)
    root.style.setProperty('--b1', t.border)
    root.style.setProperty('--b2', t.border2)
    root.style.setProperty('--acc', s.accentOverride || t.accent)
    root.style.setProperty('--blu', t.blue)
    root.style.setProperty('--red', t.red)
    root.style.setProperty('--pur', t.purple)
    root.style.setProperty('--grn', t.green)
    root.style.setProperty('--org', t.orange)
    root.style.setProperty('--tx', t.text)
    root.style.setProperty('--tm', t.textMuted)
    root.style.setProperty('--td', t.textDim)
    root.style.setProperty('--fs-base', fs.base)
    root.style.setProperty('--fs-q', fs.question)
    root.style.setProperty('--fs-h', fs.heading)
    root.style.setProperty('--fs-present', fs.present)
    root.style.setProperty('--font-body', f.body)
    root.style.setProperty('--font-mono', f.mono)
    root.style.setProperty('--font-display', f.display)
  }

  useEffect(() => { applyTheme(settings) }, [])

  return (
    <SettingsContext.Provider value={{ settings, setSettings, THEMES, FONT_SIZES, FONTS }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
