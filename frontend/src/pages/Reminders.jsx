import { motion } from 'framer-motion'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import FloatingAI from '../components/FloatingAI'
import { 
  Bell, 
  Plus, 
  Clock, 
  Calendar,
  Volume2,
  VolumeX,
  Edit3,
  Trash2,
  CheckCircle2
} from 'lucide-react'

const Reminders = () => {
  const { reminders, medications, addReminder, updateReminder, deleteReminder, markAsTaken, undoTaken } = useApp()
  const userData = { medications, reminders }

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [newReminder, setNewReminder] = useState({
    medicationId: '',
    medicationName: '',
    time: '',
    days: [],
    soundEnabled: true
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleAddReminder = (e) => {
    e.preventDefault()
    if (!newReminder.medicationId || !newReminder.time || newReminder.days.length === 0) {
      return
    }

    const selectedMed = medications.find(m => m.id.toString() === newReminder.medicationId)
    const reminder = {
      ...newReminder,
      medicationId: parseInt(newReminder.medicationId),
      medicationName: selectedMed?.name || ''
    }

    if (editingReminder) {
      updateReminder(editingReminder.id, reminder)
      setEditingReminder(null)
    } else {
      addReminder(reminder)
    }
    
    setNewReminder({ medicationId: '', medicationName: '', time: '', days: [], soundEnabled: true })
    setShowAddForm(false)
  }

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder)
    // Find the medication by ID or name
    let medId = ''
    if (reminder.medicationId) {
      medId = reminder.medicationId.toString()
    } else if (reminder.medicationName) {
      const foundMed = medications.find(m => m.name === reminder.medicationName)
      medId = foundMed?.id?.toString() || ''
    }
    
    console.log('Editing reminder:', reminder)
    console.log('Setting medicationId to:', medId)
    
    setNewReminder({
      medicationId: medId,
      medicationName: reminder.medicationName || '',
      time: reminder.time || '',
      days: reminder.days || [],
      soundEnabled: reminder.soundEnabled !== false
    })
    setShowAddForm(true)
  }

  const toggleReminder = (id) => {
    const reminder = reminders.find(r => r.id === id)
    if (reminder) {
      updateReminder(id, { ...reminder, enabled: !reminder.enabled })
    }
  }

  const toggleSound = (id) => {
    const reminder = reminders.find(r => r.id === id)
    if (reminder) {
      updateReminder(id, { ...reminder, soundEnabled: !reminder.soundEnabled })
    }
  }

  const handleMarkAsTaken = (reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId)
    markAsTaken(reminder.medicationId, reminderId)
  }

  const handleUndoTaken = (reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId)
    undoTaken(reminder.medicationId, reminderId)
  }

  const handleDayToggle = (day) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
              <Bell className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
              Reminders
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your medication reminders</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-medium flex items-center w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Reminder
          </motion.button>
        </motion.div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-bg rounded-2xl p-4 md:p-6 ${
                reminder.enabled !== false ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{reminder.medicationName || reminder.medication}</h3>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{reminder.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {reminder.days?.map(day => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {reminder.lastTaken && (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Last taken: {new Date(reminder.lastTaken).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleSound(reminder.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      reminder.soundEnabled 
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}
                    title={reminder.soundEnabled ? 'Sound On' : 'Sound Off'}
                  >
                    {reminder.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>

                  {reminder.lastTaken ? (
                    <button
                      onClick={() => handleUndoTaken(reminder.id)}
                      className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                      title="Undo taken"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsTaken(reminder.id)}
                      className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                      title="Mark as taken"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleEditReminder(reminder)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer" title={reminder.enabled !== false ? 'Enabled' : 'Disabled'}>
                    <input
                      type="checkbox"
                      checked={reminder.enabled !== false}
                      onChange={() => toggleReminder(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Reminder Modal */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card-bg rounded-2xl p-4 sm:p-6 w-full max-w-md modal-content my-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              
              <form onSubmit={handleAddReminder} className="space-y-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Medication *
                  </label>
                  <select
                    value={newReminder.medicationId}
                    onChange={(e) => setNewReminder({...newReminder, medicationId: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ colorScheme: 'light dark' }}
                    required
                  >
                    <option value="" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Select medication</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id} className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">{med.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-4 py-3 bg-input rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ colorScheme: 'light dark' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          newReminder.days.includes(day)
                            ? 'bg-blue-500/30 text-blue-600 dark:text-blue-300 border border-blue-500/50'
                            : 'bg-input text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    Sound Notification
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newReminder.soundEnabled}
                      onChange={(e) => setNewReminder({...newReminder, soundEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingReminder(null)
                      setNewReminder({ medicationId: '', medicationName: '', time: '', days: [], soundEnabled: true })
                    }}
                    className="flex-1 px-4 py-3 bg-input rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
                  >
                    {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
      <FloatingAI userData={userData} />
    </div>
  )
}

export default Reminders