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
  small:  { base: '13px', question: '16px', heading: '22px', present: '24px' },
  medium: { base: '14px', question: '18px', heading: '26px', present: '28px' },
  large:  { base: '15px', question: '20px', heading: '30px', present: '32px' },
  xl:     { base: '16px', question: '22px', heading: '34px', present: '36px' },
}

const FONTS = {
  default: { body: "'Figtree', sans-serif", mono: "'JetBrains Mono', monospace", display: "'Syne', sans-serif" },
  dyslexia: { body: "'OpenDyslexic', 'Figtree', sans-serif", mono: "'OpenDyslexic Mono', monospace", display: "'OpenDyslexic', sans-serif" },
  serif: { body: "'Georgia', serif", mono: "'Courier New', monospace", display: "'Georgia', serif" },
}

// ── ACCESSIBILITY PROFILES ───────────────────────────────────
// Based on research-supported recommendations for dyslexia and visual stress
export const ACCESSIBILITY_PROFILES = {
  none: {
    name: 'None',
    desc: 'Standard display',
    icon: '',
  },
  dyslexia: {
    name: 'Dyslexia',
    desc: 'Warm peach background · wider spacing · larger text · no italics',
    icon: '📖',
    // Research: warm backgrounds + wider spacing improve reading performance
    // (Rello & Baeza-Yates, 2017 eye-tracking study with 341 participants)
    cardBg: '#fdf0e6',         // warm peach
    cardText: '#2d1a0e',       // dark brown (not stark black — reduces contrast glare)
    cardBorder: '#e8c9a8',
    answerText: '#4a2c0a',
    font: 'Arial, Calibri, sans-serif',
    letterSpacing: '0.08em',
    lineHeight: '2.0',
    fontSize: 'xl',            // larger floor
    noItalics: true,
    wordSpacing: '0.16em',
  },
  visual_stress: {
    name: 'Visual Stress',
    desc: 'Soft turquoise background · reduced contrast · clear cell borders',
    icon: '👁',
    // Research: turquoise background achieved shortest reading duration for
    // dyslexic readers (Jakovljević et al., 2021, EEG + eye-tracking study)
    cardBg: '#e6f5f5',         // soft turquoise
    cardText: '#1a3d3d',       // dark teal (gentler than black)
    cardBorder: '#7ab8b8',     // visible border to separate items
    answerText: '#0d5c5c',
    font: 'Arial, sans-serif',
    letterSpacing: '0.06em',
    lineHeight: '1.9',
    fontSize: 'xl',
    noItalics: true,
    wordSpacing: '0.12em',
  },
  dysgraphia: {
    name: 'Dysgraphia',
    desc: 'Larger text · generous spacing · fewer items displayed at once',
    icon: '✏️',
    // Dysgraphia affects writing, not reading — display adjustments focus on
    // reducing visual clutter and increasing text size for easier reading
    cardBg: '#f8f9ff',         // very light blue-white (neutral, clean)
    cardText: '#1e1b4b',       // dark indigo
    cardBorder: '#c7d2fe',
    answerText: '#166534',
    font: 'Arial, sans-serif',
    letterSpacing: '0.05em',
    lineHeight: '1.9',
    fontSize: 'xl',
    noItalics: false,
    wordSpacing: '0.1em',
    maxQsPerCell: 4,           // limit T1/T2 to 4 per tier (2×2 grid) for less clutter
  },
}

const SettingsContext = createContext(null)

const DEFAULT = { theme: 'dark', fontSize: 'large', font: 'default', accentOverride: null, accessibilityProfile: 'none' }

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

    // Accessibility profile overrides
    const profile = ACCESSIBILITY_PROFILES[s.accessibilityProfile] || ACCESSIBILITY_PROFILES.none
    root.style.setProperty('--a11y-card-bg', profile.cardBg || '')
    root.style.setProperty('--a11y-card-text', profile.cardText || '')
    root.style.setProperty('--a11y-card-border', profile.cardBorder || '')
    root.style.setProperty('--a11y-answer-text', profile.answerText || '')
    root.style.setProperty('--a11y-letter-spacing', profile.letterSpacing || 'normal')
    root.style.setProperty('--a11y-line-height', profile.lineHeight || '1.4')
    root.style.setProperty('--a11y-word-spacing', profile.wordSpacing || 'normal')
    root.style.setProperty('--a11y-font', profile.font || '')
    // Store profile name on root for CSS selectors
    root.setAttribute('data-a11y', s.accessibilityProfile || 'none')
  }

  useEffect(() => { applyTheme(settings) }, [])

  return (
    <SettingsContext.Provider value={{ settings, setSettings, THEMES, FONT_SIZES, FONTS, ACCESSIBILITY_PROFILES }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
