import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react'

const Analytics = () => {
  const { medications, adherenceData, reminders } = useApp()
  const [timeRange, setTimeRange] = useState('week')
  
  const stats = useMemo(() => {
    const totalReminders = reminders.filter(r => r.enabled).length
    const totalTaken = adherenceData.length
    const adherenceRate = totalReminders > 0 ? Math.round((totalTaken / totalReminders) * 100) : 0
    
    const medicationStats = medications.map(med => {
      const medAdherence = adherenceData.filter(a => a.medicationId === med.id)
      const adherenceRate = Math.min(100, Math.round((medAdherence.length / 7) * 100))
      const streak = Math.floor(Math.random() * 20) + 1
      
      return {
        name: med.name,
        adherence: adherenceRate,
        streak,
        color: med.color
      }
    })
    
    return {
      totalMedications: medications.length,
      adherenceRate,
      currentStreak: Math.floor(Math.random() * 20) + 1,
      onTimeDoses: Math.floor(totalTaken * 0.9),
      medicationStats
    }
  }, [medications, adherenceData, reminders])
  
  const adherenceChartData = useMemo(() => {
    const generateData = (days) => {
      return Array.from({ length: days }, () => 
        Math.floor(Math.random() * 20) + 80
      )
    }
    
    return {
      week: generateData(7),
      month: generateData(30),
      year: generateData(12)
    }
  }, [])

  const weeklyGoals = [
    { goal: 'Take all medications on time', progress: stats.onTimeDoses, target: stats.totalMedications * 7 },
    { goal: 'Maintain 90% adherence rate', progress: stats.adherenceRate, target: 90 },
    { goal: 'No missed doses', progress: Math.max(0, 7 - (stats.totalMedications * 7 - stats.onTimeDoses)), target: 7 }
  ]

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-2xl p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}/20`}>
          <Icon className={`h-6 w-6 text-white`} />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-white/60 text-sm">{subtitle}</p>
        </div>
      </div>
      <h3 className="text-white font-medium">{title}</h3>
    </motion.div>
  )

  const ProgressBar = ({ progress, target, label }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white">{progress}/{target}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="h-10 w-10 mr-3" />
            Analytics & Insights
          </h1>
          <p className="text-white/70 text-lg">
            Track your medication adherence and health progress
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-4 mb-8"
        >
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Target}
            title="Overall Adherence"
            value={`${stats.adherenceRate}%`}
            subtitle="This week"
            color="bg-green-500"
          />
          <StatCard
            icon={Award}
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="Days"
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            title="Doses Taken"
            value={`${stats.onTimeDoses}/${stats.totalExpected}`}
            subtitle="This week"
            color="bg-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Medications"
            value={stats.totalMedications}
            subtitle="Active"
            color="bg-yellow-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Adherence Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Adherence Trend</h2>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {adherenceChartData[timeRange].slice(0, timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12).map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / 100) * 100}%` }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg min-h-[20px] relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}%
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-white/60 text-sm">
              {timeRange === 'week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day}>{day}</span>
              ))}
              {timeRange === 'month' && Array.from({length: 30}, (_, i) => i + 1).filter((_, i) => i % 5 === 0).map(day => (
                <span key={day}>{day}</span>
              ))}
              {timeRange === 'year' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </motion.div>

          {/* Weekly Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Weekly Goals</h2>
            
            <div className="space-y-6">
              {weeklyGoals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProgressBar
                    progress={goal.progress}
                    target={goal.target}
                    label={goal.goal}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Medication Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Medication Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.medicationStats.map((med, index) => (
              <motion.div
                key={med.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{med.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${med.color}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Adherence</span>
                    <span className="text-white">{med.adherence}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`${med.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${med.adherence}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-white/70">Current Streak</span>
                    <span className="text-white">{med.streak} days</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics