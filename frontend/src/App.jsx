import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
     <Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />

    <Route element={<ProtectedRoute />}>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/tasks' element={<Tasks />} />
    </Route>

    <Route path='/' element={<Navigate to="/dashboard" replace />} />
  </Routes>
  )

}

export default App;