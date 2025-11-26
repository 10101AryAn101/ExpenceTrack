import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AddExpense from './pages/AddExpense'
import EditExpense from './pages/EditExpense'
import Login from './pages/Login'
import Register from './pages/Register'
import Help from './pages/Help'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expense/add" element={<AddExpense />} />
            <Route path="/expense/edit/:id" element={<EditExpense />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
