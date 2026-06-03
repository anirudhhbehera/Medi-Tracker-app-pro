import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const AuthContext = createContext()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medi-tracker-app-pro.onrender.com/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('currentUser')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })

      const { token, user: userData } = response.data
      
      // Store token and user data
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)
      return true
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password
      })

      const { token, user: userData } = response.data
      
      // Store token and user data
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      
      setUser(userData)
      toast.success(`Welcome, ${name}!`)
      return true
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.response?.data?.message || 'Signup failed')
      return false
    }
  }

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    
    // Clear any session-specific data
    if (user?.id) {
      localStorage.removeItem(`appData_${user.id}`)
    }
    
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
