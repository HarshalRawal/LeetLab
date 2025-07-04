import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from './Store/useAuthStore.js'
import { Loader } from 'lucide-react'
import Layout from './Layout/Layout.jsx'
import { ProblemForm } from './components/problem-form/problem-form.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        
        {/* Parent Route with Layout */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
        </Route>

        {/* Admin Route */}
        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <ProblemForm/> : <Navigate to={"/"}/>}
          />
        </Route>

        {/* Public Routes */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App
