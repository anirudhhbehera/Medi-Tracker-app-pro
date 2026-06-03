import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import { medicationAPI, reminderAPI } from '../services/api'

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
  }, [authUser?.id, authUser?.sessionId])

  const loadDataFromAPI = async () => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      
      if (!userId) {
        console.log('No user ID found')
        return
      }

      // Try to load from backend API
      try {
        const [medsRes, remindersRes] = await Promise.all([
          medicationAPI.getAll(userId),
          reminderAPI.getAll(userId)
        ])
        
        const medications = medsRes.data || []
        const reminders = remindersRes.data || []
        
        dispatch({ 
          type: 'LOAD_DATA', 
          payload: { medications, reminders, adherenceData: [] }
        })
        
        console.log('Loaded data from API:', { medications: medications.length, reminders: reminders.length })
        return
      } catch (apiError) {
        console.log('API load failed, using localStorage:', apiError.message)
        
        // Fallback to localStorage
        const storageKey = `appData_${userId}`
        const savedData = localStorage.getItem(storageKey)
        
        if (savedData) {
          dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) })
          console.log('Loaded from localStorage')
        } else {
          // Load demo data for new users
          dispatch({ type: 'LOAD_DATA', payload: DEMO_DATA })
          localStorage.setItem(storageKey, JSON.stringify(DEMO_DATA))
          console.log('Loaded demo data')
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load data')
    }
  }

  // Save to localStorage AND API whenever state changes
  useEffect(() => {
    const userId = authUser?.id || authUser?.sessionId
    if (userId && (state.medications.length > 0 || state.reminders.length > 0)) {
      // Save to localStorage as backup
      localStorage.setItem(`appData_${userId}`, JSON.stringify({
        medications: state.medications,
        reminders: state.reminders,
        adherenceData: state.adherenceData
      }))
      
      // TODO: Sync to backend API (implement batch save endpoint)
      // This ensures data persists even if backend is down
    }
  }, [state.medications, state.reminders, state.adherenceData, authUser])



  const addMedication = async (medication) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      const newMed = {
        ...medication,
        userId,
        createdAt: new Date().toISOString(),
        color: medication.color || `bg-${['blue', 'green', 'purple', 'pink', 'indigo'][Math.floor(Math.random() * 5)]}-500`
      }
      
      // Try to save to backend
      try {
        const response = await medicationAPI.create(newMed)
        newMed.id = response.data._id || response.data.id || Date.now()
      } catch (apiError) {
        console.log('API save failed, using local ID:', apiError.message)
        newMed.id = Date.now()
      }
      
      dispatch({ type: 'ADD_MEDICATION', payload: newMed })
      toast.success('Medication added successfully!')
    } catch (error) {
      toast.error('Failed to save medication')
    }
  }

  const updateMedication = async (id, updates) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      
      // Try to update on backend
      try {
        await medicationAPI.update(id, updates, userId)
      } catch (apiError) {
        console.log('API update failed, updating locally:', apiError.message)
      }
      
      dispatch({ type: 'UPDATE_MEDICATION', payload: { id, ...updates } })
      toast.success('Medication updated!')
    } catch (error) {
      toast.error('Failed to update medication')
    }
  }

  const deleteMedication = async (id) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      
      // Try to delete from backend
      try {
        await medicationAPI.delete(id, userId)
      } catch (apiError) {
        console.log('API delete failed, deleting locally:', apiError.message)
      }
      
      dispatch({ type: 'DELETE_MEDICATION', payload: id })
      toast.success('Medication deleted!')
    } catch (error) {
      toast.error('Failed to delete medication')
    }
  }

  const addReminder = async (reminder) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      const newReminder = {
        ...reminder,
        userId,
        enabled: true,
        createdAt: new Date().toISOString()
      }
      
      // Try to save to backend
      try {
        const response = await reminderAPI.create(newReminder)
        newReminder.id = response.data._id || response.data.id || Date.now()
      } catch (apiError) {
        console.log('API save failed, using local ID:', apiError.message)
        newReminder.id = Date.now()
      }
      
      dispatch({ type: 'ADD_REMINDER', payload: newReminder })
      toast.success('Reminder added!')
    } catch (error) {
      toast.error('Failed to save reminder')
    }
  }

  const updateReminder = async (id, updates) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      
      // Try to update on backend
      try {
        await reminderAPI.update(id, updates, userId)
      } catch (apiError) {
        console.log('API update failed, updating locally:', apiError.message)
      }
      
      dispatch({ type: 'UPDATE_REMINDER', payload: { id, ...updates } })
      toast.success('Reminder updated!')
    } catch (error) {
      toast.error('Failed to update reminder')
    }
  }

  const deleteReminder = async (id) => {
    try {
      const userId = authUser?.id || authUser?.sessionId
      
      // Try to delete from backend
      try {
        await reminderAPI.delete(id, userId)
      } catch (apiError) {
        console.log('API delete failed, deleting locally:', apiError.message)
      }
      
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