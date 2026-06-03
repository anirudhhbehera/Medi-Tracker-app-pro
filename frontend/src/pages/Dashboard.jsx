import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import FloatingAI from '../components/FloatingAI'
import { 
  Pill, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  Brain
} from 'lucide-react'

const Dashboard = () => {
  const { getStats, getTodayReminders, markAsTaken, undoTaken, medications, reminders } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Get fresh data on every render
  const stats = getStats()
  const upcomingReminders = getTodayReminders()
  const userData = { medications, reminders }

  const handleTakeNow = async (medicationId, reminderId) => {
    await markAsTaken(medicationId, reminderId)
  }

  const handleUndoTaken = async (medicationId, reminderId) => {
    await undoTaken(medicationId, reminderId)
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-bg rounded-2xl p-4 sm:p-6 card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}/20`}>
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Good Morning, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Here's your medication overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <StatCard
            icon={Pill}
            title="Total Medications"
            value={stats.totalMedications}
            color="bg-blue-500/20"
          />
          <StatCard
            icon={Clock}
            title="Today's Reminders"
            value={stats.todayReminders}
            color="bg-green-500/20"
          />
          <StatCard
            icon={TrendingUp}
            title="Adherence Rate"
            value={`${stats.adherenceRate}%`}
            color="bg-purple-500/20"
            trend="+5% from last week"
          />
          <StatCard
            icon={AlertCircle}
            title="Missed Doses"
            value={stats.missedDoses}
            color="bg-red-500/20"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Today's Reminders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card-bg rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Today's Schedule
              </h2>
              <button 
                onClick={() => navigate('/reminders')}
                className="btn-primary px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl border gap-3 sm:gap-0 ${
                    reminder.taken 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      reminder.taken ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {reminder.taken ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Pill className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-800 dark:text-white font-medium truncate">{reminder.medicationName || reminder.medication}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{reminder.time}</p>
                      {reminder.lastTaken && (
                        <p className="text-green-600 dark:text-green-400 text-xs">Last taken: {new Date(reminder.lastTaken).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    {!reminder.taken ? (
                      <button 
                        onClick={() => handleTakeNow(reminder.medicationId, reminder.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm sm:text-base whitespace-nowrap"
                      >
                        Take Now
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUndoTaken(reminder.medicationId, reminder.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm sm:text-base whitespace-nowrap"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card-bg rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Pill, label: 'Add Medication', color: 'bg-blue-500/20' },
                { icon: Clock, label: 'Set Reminder', color: 'bg-green-500/20' },
                { icon: Brain, label: 'View Insights', color: 'bg-purple-500/20' },
                { icon: AlertCircle, label: 'Emergency Info', color: 'bg-red-500/20' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => {
                    if (action.label === 'Add Medication') navigate('/medications')
                    else if (action.label === 'Set Reminder') navigate('/reminders')
                    else if (action.label === 'View Insights') navigate('/ai-insights')
                    else if (action.label === 'Emergency Info') navigate('/ai-insights')
                  }}
                  className={`${action.color}/20 p-3 sm:p-4 rounded-xl text-gray-800 dark:text-white hover:${action.color}/30 transition-all duration-200`}
                >
                  <action.icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium">{action.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <FloatingAI userData={userData} />
    </div>
  )
}

export default Dashboard