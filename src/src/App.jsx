import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth.jsx'
import { SettingsProvider } from './lib/settings.jsx'
import AuthPage from './components/AuthPage.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import Generate from './components/Generate.jsx'
import Present from './components/Present.jsx'
import StudentView from './components/StudentView.jsx'
import QuestionBank from './components/QuestionBank.jsx'
import Analytics from './components/Analytics.jsx'
import UnitPlan from './components/UnitPlan.jsx'
import PATData from './components/PATData.jsx'
import Settings from './components/Settings.jsx'
import Homework from './components/Homework.jsx'
import Checkin from './components/Checkin.jsx'
import './styles/globals.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner"/></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/student" element={<StudentView />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="generate" element={<Generate />} />
              <Route path="present" element={<Present />} />
              <Route path="checkin" element={<Checkin />} />
              <Route path="bank" element={<QuestionBank />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="unitplan" element={<UnitPlan />} />
              <Route path="pat" element={<PATData />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  )
}
