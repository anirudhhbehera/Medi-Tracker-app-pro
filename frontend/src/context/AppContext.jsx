import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const AppContext = createContext()

// Sample data for demo user
const DEMO_DATA = {
  medications: [
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'Once daily',
      time: '09:00',
      stock: 28,
      color: 'bg-blue-500',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      time: '09:00',
      stock: 5,
      color: 'bg-yellow-500',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Blood Pressure Med',
      dosage: '10mg',
      frequency: 'Twice daily',
      time: '08:00',
      stock: 15,
      color: 'bg-red-500',
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Calcium',
      dosage: '500mg',
      frequency: 'Once daily',
      time: '20:00',
      stock: 45,
      color: 'bg-green-500',
      createdAt: new Date().toISOString()
    }
  ],
  reminders: [
    {
      id: 1,
      medicationId: 1,
      medicationName: 'Aspirin',
      time: '09:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      soundEnabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      medicationId: 2,
      medicationName: 'Vitamin D',
      time: '09:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      soundEnabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      medicationId: 3,
      medicationName: 'Blood Pressure Med',
      time: '08:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      soundEnabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      medicationId: 3,
      medicationName: 'Blood Pressure Med',
      time: '20:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      soundEnabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      medicationId: 4,
      medicationName: 'Calcium',
      time: '20:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      soundEnabled: true,
      createdAt: new Date().toISOString()
    }
  ],
  adherenceData: []
}

const initialState = {
  medications: [],
  reminders: [],
  adherenceData: [],
  user: { id: 'user1', name: 'User' }
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MEDICATION':
      const newMed = {
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        color: action.payload.color || `bg-${['blue', 'green', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 5)]}-500`
      }
      return { ...state, medications: [...state.medications, newMed] }
    
    case 'UPDATE_MEDICATION':
      return {
        ...state,
        medications: state.medications.map(med =>
          med.id === action.payload.id ? { ...med, ...action.payload } : med
        )
      }
    
    case 'DELETE_MEDICATION':
      return {
        ...state,
        medications: state.medications.filter(med => med.id !== action.payload),
        reminders: state.reminders.filter(rem => rem.medicationId !== action.payload)
      }
    
    case 'ADD_REMINDER':
      const newReminder = {
        id: Date.now(),
        ...action.payload,
        enabled: true,
        createdAt: new Date().toISOString()
      }
      return { ...state, reminders: [...state.reminders, newReminder] }
    
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(rem =>
          rem.id === action.payload.id ? { ...action.payload } : rem
        )
      }
    
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(rem => rem.id !== action.payload)
      }
    
    case 'MARK_TAKEN':
      const adherenceEntry = {
        id: Date.now(),
        medicationId: action.payload.medicationId,
        reminderId: action.payload.reminderId,
        takenAt: new Date().toISOString(),
        status: 'taken'
      }
      return {
        ...state,
        adherenceData: [...state.adherenceData, adherenceEntry],
        reminders: state.reminders.map(rem =>
          rem.id === action.payload.reminderId 
            ? { ...rem, lastTaken: new Date().toISOString() }
            : rem
        )
      }
    
    case 'LOAD_DATA':
      const loadedMedications = action.payload.medications?.map(med => ({
        ...med,
        color: med.color || `bg-${['blue', 'green', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 5)]}-500`
      })) || []
      return { ...state, ...action.payload, medications: loadedMedications }
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { user: authUser } = useAuth()

  useEffect(() => {
    if (authUser) {
      loadDataFromAPI()
    }
  }, [authUser?.sessionId])

  const loadDataFromAPI = async () => {
    try {
      const storageKey = `appData_${authUser.sessionId}`
      
      // For demo users, load fresh sample data on each new session
      if (authUser?.originalId === 'user1' || authUser?.originalId === 'user2') {
        const savedData = localStorage.getItem(storageKey)
        if (savedData) {
          // Load existing session data
          dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) })
        } else {
          // New session - load fresh sample data
          dispatch({ type: 'LOAD_DATA', payload: DEMO_DATA })
          localStorage.setItem(storageKey, JSON.stringify(DEMO_DATA))
        }
        return
      }

      // For other users, try API or use empty data
      const [medsRes, remindersRes] = await Promise.all([
        fetch(`http://localhost:8080/api/medications?userId=${authUser.sessionId}`),
        fetch(`http://localhost:8080/api/reminders?userId=${authUser.sessionId}`)
      ])
      
      if (medsRes.ok && remindersRes.ok) {
        const medications = await medsRes.json()
        const reminders = await remindersRes.json()
        dispatch({ 
          type: 'LOAD_DATA', 
          payload: { medications, reminders, adherenceData: [] }
        })
      } else {
        // Load from localStorage or empty
        const savedData = localStorage.getItem(storageKey)
        if (savedData) {
          dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) })
        } else {
          dispatch({ type: 'LOAD_DATA', payload: { medications: [], reminders: [], adherenceData: [] } })
        }
      }
    } catch (error) {
      console.error('Failed to load data from API:', error)
      // Load from localStorage
      const savedData = localStorage.getItem(`appData_${authUser.sessionId}`)
      if (savedData) {
        dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) })
      }
    }
  }

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (authUser?.sessionId && (state.medications.length > 0 || state.reminders.length > 0)) {
      localStorage.setItem(`appData_${authUser.sessionId}`, JSON.stringify({
        medications: state.medications,
        reminders: state.reminders,
        adherenceData: state.adherenceData
      }))
    }
  }, [state.medications, state.reminders, state.adherenceData, authUser?.sessionId])



  const addMedication = async (medication) => {
    try {
      const newMed = {
        id: Date.now(),
        ...medication,
        userId: authUser.sessionId,
        createdAt: new Date().toISOString(),
        color: medication.color || `bg-${['blue', 'green', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 5)]}-500`
      }
      dispatch({ type: 'ADD_MEDICATION', payload: newMed })
      toast.success('Medication added successfully!')
    } catch (error) {
      toast.error('Failed to save medication')
    }
  }

  const updateMedication = async (id, updates) => {
    try {
      dispatch({ type: 'UPDATE_MEDICATION', payload: { id, ...updates } })
      toast.success('Medication updated!')
    } catch (error) {
      toast.error('Failed to update medication')
    }
  }

  const deleteMedication = async (id) => {
    try {
      dispatch({ type: 'DELETE_MEDICATION', payload: id })
      toast.success('Medication deleted!')
    } catch (error) {
      toast.error('Failed to delete medication')
    }
  }

  const addReminder = async (reminder) => {
    try {
      const newReminder = {
        id: Date.now(),
        ...reminder,
        userId: authUser.sessionId,
        enabled: true,
        createdAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_REMINDER', payload: newReminder })
      toast.success('Reminder added!')
    } catch (error) {
      toast.error('Failed to save reminder')
    }
  }

  const updateReminder = async (id, updates) => {
    try {
      dispatch({ type: 'UPDATE_REMINDER', payload: { id, ...updates } })
      toast.success('Reminder updated!')
    } catch (error) {
      toast.error('Failed to update reminder')
    }
  }

  const deleteReminder = async (id) => {
    try {
      dispatch({ type: 'DELETE_REMINDER', payload: id })
      toast.success('Reminder deleted!')
    } catch (error) {
      toast.error('Failed to delete reminder')
    }
  }

  const markAsTaken = async (medicationId, reminderId) => {
    try {
      const reminder = state.reminders.find(r => r.id === reminderId)
      if (reminder) {
        dispatch({ type: 'UPDATE_REMINDER', payload: { 
          id: reminderId, 
          ...reminder,
          lastTaken: new Date().toISOString() 
        } })
        dispatch({ type: 'MARK_TAKEN', payload: { medicationId, reminderId } })
        toast.success('Marked as taken!')
      }
    } catch (error) {
      toast.error('Failed to mark as taken')
    }
  }

  const undoTaken = async (medicationId, reminderId) => {
    try {
      const reminder = state.reminders.find(r => r.id === reminderId)
      if (reminder) {
        dispatch({ type: 'UPDATE_REMINDER', payload: { 
          id: reminderId, 
          ...reminder,
          lastTaken: null 
        } })
        toast.success('Undone!')
      }
    } catch (error) {
      toast.error('Failed to undo')
    }
  }

  const getStats = useCallback(() => {
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
    const today = new Date().toDateString()
    
    const todayReminders = state.reminders
      .filter(r => (r.enabled !== false) && r.days?.includes(currentDay))
      .map(r => ({
        ...r,
        taken: r.lastTaken ? new Date(r.lastTaken).toDateString() === today : false
      }))
    
    const takenToday = todayReminders.filter(r => r.taken).length
    
    return {
      totalMedications: state.medications.length,
      todayReminders: todayReminders.length,
      adherenceRate: todayReminders.length > 0 ? Math.round((takenToday / todayReminders.length) * 100) : 0,
      missedDoses: Math.max(0, todayReminders.length - takenToday)
    }
  }, [state.medications, state.reminders])

  const getTodayReminders = useCallback(() => {
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
    const today = new Date().toDateString()
    
    return state.reminders
      .filter(r => (r.enabled !== false) && r.days?.includes(currentDay))
      .map(r => ({
        ...r,
        taken: r.lastTaken ? new Date(r.lastTaken).toDateString() === today : false
      }))
  }, [state.reminders])

  const value = {
    ...state,
    addMedication,
    updateMedication,
    deleteMedication,
    addReminder,
    updateReminder,
    deleteReminder,
    markAsTaken,
    undoTaken,
    getStats,
    getTodayReminders
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}