import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase.js'

export default function UnitPlan() {
  const { user } = useAuth()
  return (
    <div className="page-wrap">
      <div className="page-title">UnitPlan</div>
      <p className="page-sub">Coming soon — this section is being built.</p>
    </div>
  )
}
