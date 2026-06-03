import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const SAMPLE_USERS = [
  {
    id: 'user1',
    email: 'demo@meditracker.com',
    password: 'demo123',
    name: 'Demo User',
    avatar: '👤'
  },
  {
    id: 'user2',
    email: 'john@example.com',
    password: 'john123',
    name: 'John Doe',
    avatar: '👨'
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = SAMPLE_USERS.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      // Generate unique session ID for each login
      const sessionId = `${foundUser.id}_${Date.now()}`
      const userWithSession = {
        ...foundUser,
        sessionId,
        originalId: foundUser.id
      }
      delete userWithSession.password
      
      setUser(userWithSession)
      localStorage.setItem('currentUser', JSON.stringify(userWithSession))
      toast.success(`Welcome back, ${foundUser.name}!`)
      return true
    }
    
    toast.error('Invalid email or password')
    return false
  }

  const signup = (name, email, password) => {
    const existingUser = SAMPLE_USERS.find(u => u.email === email)
    
    if (existingUser) {
      toast.error('Email already exists')
      return false
    }

    const sessionId = `user${Date.now()}`
    const newUser = {
      id: sessionId,
      sessionId,
      originalId: sessionId,
      email,
      name,
      avatar: '👤'
    }

    setUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    toast.success(`Welcome, ${name}!`)
    return true
  }

  const logout = () => {
    // Clear session-specific data on logout
    if (user?.sessionId) {
      localStorage.removeItem(`appData_${user.sessionId}`)
    }
    setUser(null)
    localStorage.removeItem('currentUser')
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
