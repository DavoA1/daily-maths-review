// ── SLIDE STORE ──────────────────────────────────────────────
// Module-level store so slides persist across navigation
// Generate writes here, Present reads from here

let _slides = []
let _timerSecs = 20
let _btbSecs = 90

export function getSlides()         { return _slides }
export function setStoredSlides(s)  { _slides = s }
export function getTimerSecs()      { return _timerSecs }
export function getBtbSecs()        { return _btbSecs }
export function setTimerConfig(t, b) { _timerSecs = t; _btbSecs = b }
export function hasSlides()         { return _slides.length > 0 }
