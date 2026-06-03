import { motion } from 'framer-motion'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import FloatingAI from '../components/FloatingAI'
import { 
  Plus, 
  Search, 
  Filter, 
  Pill, 
  Clock, 
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react'

const Medications = () => {
  const { medications, addMedication, deleteMedication, updateMedication, reminders } = useApp()
  const userData = { medications, reminders }
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    stock: ''
  })

  const handleAddMedication = (e) => {
    e.preventDefault()
    if (!newMedication.name || !newMedication.dosage) {
      return
    }

    const medication = {
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency || '',
      time: newMedication.time || '',
      stock: parseInt(newMedication.stock) || 0
    }

    if (editingMed) {
      updateMedication(editingMed.id, medication)
      setEditingMed(null)
    } else {
      addMedication(medication)
    }
    
    setNewMedication({ name: '', dosage: '', frequency: '', time: '', stock: '' })
    setShowAddForm(false)
  }

  const handleEditMedication = (med) => {
    setEditingMed(med)
    setNewMedication({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time || '',
      stock: med.stock.toString()
    })
    setShowAddForm(true)
  }

  const handleDeleteMedication = (id) => {
    deleteMedication(id)
  }

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">Medications</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your medication list</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium flex items-center w-full sm:w-auto justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Medication
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-bg rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button className="px-4 sm:px-6 py-3 bg-input rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center w-full sm:w-auto">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Medications Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredMedications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card-bg rounded-2xl p-4 sm:p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${medication.color || 'bg-blue-500'}/20`}>
                  <Pill className={`h-6 w-6 text-blue-600 dark:text-blue-400`} />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditMedication(medication)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{medication.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{medication.dosage}</p>

              <div className="space-y-3">
                {medication.time && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{medication.time}</span>
                  </div>
                )}
                {medication.frequency && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{medication.frequency}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Stock remaining</span>
                  <div className="flex items-center">
                    {medication.stock <= 7 && (
                      <AlertTriangle className="h-4 w-4 text-yellow-400 mr-1" />
                    )}
                    <span className={`font-medium ${
                      medication.stock <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-white'
                    }`}>
                      {medication.stock} pills
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Medication Modal */}
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
                {editingMed ? 'Edit Medication' : 'Add New Medication'}
              </h2>
              
              <form onSubmit={handleAddMedication} className="space-y-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="w-full px-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter medication name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="w-full px-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g., 100mg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Frequency
                  </label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    style={{ colorScheme: 'light dark' }}
                  >
                    <option value="" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Select frequency</option>
                    <option value="Once daily" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Once daily</option>
                    <option value="Twice daily" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Twice daily</option>
                    <option value="Three times daily" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">Three times daily</option>
                    <option value="As needed" className="text-gray-800 dark:text-white bg-white dark:bg-gray-800">As needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                    className="w-full px-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-white"
                    style={{ colorScheme: 'light dark' }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    value={newMedication.stock}
                    onChange={(e) => setNewMedication({...newMedication, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Number of pills"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingMed(null)
                      setNewMedication({ name: '', dosage: '', frequency: '', time: '', stock: '' })
                    }}
                    className="flex-1 px-4 py-3 bg-input rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
                  >
                    {editingMed ? 'Update Medication' : 'Add Medication'}
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

export default Medications