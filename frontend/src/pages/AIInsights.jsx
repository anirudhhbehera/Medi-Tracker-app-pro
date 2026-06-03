import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const AIInsights = () => {
  const { medications, reminders } = useApp()
  const [insights, setInsights] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Load Puter.js for unlimited AI
    if (!window.puter) {
      const script = document.createElement('script')
      script.src = 'https://js.puter.com/v2/'
      script.async = true
      script.onload = () => console.log('Puter.js loaded - Unlimited AI ready!')
      document.head.appendChild(script)
    }
    generateInsights()
  }, [medications, reminders])

  const generateInsights = () => {
    const newInsights = []
    const today = new Date().toDateString()
    const takenToday = reminders.filter(r => r.lastTaken && new Date(r.lastTaken).toDateString() === today).length
    const totalActive = reminders.filter(r => r.enabled !== false).length
    
    // Stock insights with variations
    const lowStock = medications.filter(m => m.stock && m.stock <= 7)
    if (lowStock.length > 0) {
      const stockMessages = [
        `${lowStock.length} medication(s) running low: ${lowStock.map(m => m.name).join(', ')}. Refill soon!`,
        `Time to restock! ${lowStock.map(m => `${m.name} (${m.stock} left)`).join(', ')}. Don't run out!`,
        `Low inventory alert: ${lowStock.length} medication(s) need refilling - ${lowStock.map(m => m.name).join(', ')}.`,
        `Running low on ${lowStock.map(m => m.name).join(', ')}. Schedule a pharmacy visit soon!`
      ]
      newInsights.push({
        id: Math.random(),
        type: 'warning',
        title: 'Low Stock Alert',
        description: stockMessages[Math.floor(Math.random() * stockMessages.length)],
        icon: AlertTriangle,
        color: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400'
      })
    }
    
    // Adherence insights with variations
    if (totalActive > 0) {
      const adherenceRate = Math.round((takenToday / totalActive) * 100)
      const adherenceMessages = {
        high: [
          `${adherenceRate}% adherence today (${takenToday}/${totalActive} doses). Outstanding work!`,
          `Excellent! ${takenToday} out of ${totalActive} doses taken. You're at ${adherenceRate}% adherence!`,
          `${adherenceRate}% adherence rate today. Keep up this amazing consistency!`,
          `Perfect adherence! ${takenToday}/${totalActive} doses completed. You're doing great!`
        ],
        medium: [
          `${adherenceRate}% adherence today (${takenToday}/${totalActive} doses). Keep building that habit!`,
          `Good progress! ${takenToday} of ${totalActive} doses taken. You're at ${adherenceRate}%.`,
          `You've taken ${takenToday}/${totalActive} doses today (${adherenceRate}%). Keep going!`,
          `${adherenceRate}% adherence so far. ${totalActive - takenToday} more dose(s) to go today!`
        ]
      }
      
      const messages = adherenceRate >= 80 ? adherenceMessages.high : adherenceMessages.medium
      newInsights.push({
        id: Math.random(),
        type: adherenceRate >= 80 ? 'success' : 'info',
        title: adherenceRate >= 80 ? 'Excellent Adherence!' : 'Good Progress',
        description: messages[Math.floor(Math.random() * messages.length)],
        icon: TrendingUp,
        color: adherenceRate >= 80 ? 'bg-green-500/20' : 'bg-blue-500/20',
        iconColor: adherenceRate >= 80 ? 'text-green-400' : 'text-blue-400'
      })
    }
    
    // Medication overview with variations
    if (medications.length > 0) {
      const overviewMessages = [
        `Managing ${medications.length} medication(s) with ${reminders.length} reminder(s). Stay organized!`,
        `You're tracking ${medications.length} medication(s) and ${reminders.length} reminder(s). Great job!`,
        `${medications.length} medication(s) in your tracker with ${reminders.length} active reminder(s).`,
        `Your health routine: ${medications.length} medication(s), ${reminders.length} reminder(s). Well done!`
      ]
      newInsights.push({
        id: Math.random(),
        type: 'info',
        title: 'Medication Overview',
        description: overviewMessages[Math.floor(Math.random() * overviewMessages.length)],
        icon: Brain,
        color: 'bg-purple-500/20',
        iconColor: 'text-purple-400'
      })
    }
    
    // Health tips with variations
    const healthTips = [
      'Take medications with water unless directed otherwise. Stay hydrated throughout the day!',
      'Set a consistent time for medications to build a strong routine. Consistency is key!',
      'Keep a medication journal to track side effects and effectiveness. Knowledge is power!',
      'Store medications in a cool, dry place away from direct sunlight. Proper storage matters!',
      'Never share prescription medications with others. They\'re prescribed specifically for you!',
      'Check expiration dates regularly and dispose of expired medications safely.',
      'Take medications with food if they cause stomach upset, unless directed otherwise.',
      'Set phone alarms or use our reminder system to never miss a dose!'
    ]
    
    newInsights.push({
      id: Math.random(),
      type: 'success',
      title: 'Daily Health Tip',
      description: healthTips[Math.floor(Math.random() * healthTips.length)],
      icon: Sparkles,
      color: 'bg-green-500/20',
      iconColor: 'text-green-400'
    })
    
    // Shuffle insights for variety
    const shuffled = newInsights.sort(() => Math.random() - 0.5)
    setInsights(shuffled)
  }

  const refreshInsights = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      generateInsights()
      setIsRefreshing(false)
      toast.success('Insights refreshed!')
    }, 500)
  }

  const getEnhancedResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Medical knowledge base
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
      if (lowerMessage.includes('normal') || lowerMessage.includes('average') || lowerMessage.includes('avg')) {
        return 'Normal blood pressure is around 120/80 mmHg. Readings below 120/80 are considered optimal, while 120-129/<80 is elevated. Hypertension starts at 130/80 or higher. Always consult your doctor for personalized advice.'
      }
      return 'Blood pressure measures the force of blood against artery walls. It\'s recorded as systolic/diastolic (e.g., 120/80). Regular monitoring is important for heart health.'
    }
    
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      return 'Normal fasting blood sugar is 70-100 mg/dL. Prediabetes is 100-125 mg/dL, and diabetes is 126 mg/dL or higher. Regular monitoring and a healthy lifestyle are key to management.'
    }
    
    if (lowerMessage.includes('heart rate') || lowerMessage.includes('pulse')) {
      return 'Normal resting heart rate for adults is 60-100 beats per minute. Athletes may have lower rates (40-60 bpm). Factors like fitness, stress, and medications can affect heart rate.'
    }
    
    if (lowerMessage.includes('cholesterol')) {
      return 'Total cholesterol should be below 200 mg/dL. LDL (bad) cholesterol should be under 100 mg/dL, and HDL (good) cholesterol should be 60 mg/dL or higher. Diet and exercise help manage levels.'
    }
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('fever')) {
      return 'Normal body temperature is around 98.6°F (37°C). A fever is generally 100.4°F (38°C) or higher. Mild fevers help fight infections, but high fevers (>103°F) need medical attention.'
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      return 'Adults should drink about 8 glasses (64 oz) of water daily, though needs vary by activity, climate, and health. Proper hydration supports all bodily functions.'
    }
    
    if (lowerMessage.includes('sleep')) {
      return 'Adults need 7-9 hours of sleep per night. Quality sleep is essential for physical health, mental clarity, and immune function. Maintain a consistent sleep schedule for best results.'
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return 'Adults should aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly, plus strength training twice a week. Start slowly and build up gradually.'
    }
    
    if (lowerMessage.includes('vitamin')) {
      return 'Vitamins are essential nutrients. Vitamin D supports bones, B vitamins aid energy, C boosts immunity, and A helps vision. A balanced diet usually provides adequate vitamins, but supplements may help if deficient.'
    }
    
    if (lowerMessage.includes('aspirin')) {
      return 'Aspirin is a pain reliever and blood thinner. Low-dose aspirin may prevent heart attacks in some people. Always consult your doctor before starting aspirin therapy, as it can cause bleeding.'
    }
    
    // Medication-related queries
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      if (medications.length > 0) {
        return `You're taking ${medications.length} medication(s): ${medications.map(m => m.name).join(', ')}. Track adherence regularly and never skip doses without consulting your doctor.`
      }
      return 'Always take medications as prescribed. Set reminders, track your doses, and inform your doctor about all medications you\'re taking to avoid interactions.'
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('refill')) {
      const lowStock = medications.filter(m => m.stock <= 7)
      if (lowStock.length > 0) {
        return `⚠️ ${lowStock.length} medication(s) low: ${lowStock.map(m => `${m.name} (${m.stock} left)`).join(', ')}. Refill soon to avoid missing doses!`
      }
      return 'All medications well-stocked! Keep tracking your inventory to ensure you never run out.'
    }
    
    if (lowerMessage.includes('reminder')) {
      return `You have ${reminders.length} active reminder(s). Consistent medication timing improves effectiveness. Use our reminder system to stay on track!`
    }
    
    if (lowerMessage.includes('adherence') || lowerMessage.includes('taken')) {
      const today = new Date().toDateString()
      const takenToday = reminders.filter(r => r.lastTaken && new Date(r.lastTaken).toDateString() === today).length
      const totalActive = reminders.filter(r => r.enabled !== false).length
      if (totalActive > 0) {
        const rate = Math.round((takenToday / totalActive) * 100)
        return `Adherence: ${rate}% (${takenToday}/${totalActive} doses today). ${rate >= 80 ? 'Excellent work!' : 'Keep building that habit!'} Consistency is key to treatment success.`
      }
      return 'Set reminders to track adherence. Studies show that medication adherence improves health outcomes by up to 50%.'
    }
    
    if (lowerMessage.includes('side effect')) {
      return 'Common medication side effects include nausea, dizziness, or drowsiness. Most are mild and temporary. Contact your doctor if side effects are severe or persistent.'
    }
    
    if (lowerMessage.includes('interaction')) {
      return 'Drug interactions occur when medications affect each other. Always inform your doctor and pharmacist about all medications, supplements, and herbs you take.'
    }
    
    // General health queries
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
      return 'A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugar, and sodium. Nutrition directly impacts medication effectiveness.'
    }
    
    if (lowerMessage.includes('stress')) {
      return 'Chronic stress affects health and medication effectiveness. Practice relaxation techniques, exercise, get adequate sleep, and consider meditation or yoga. Seek support when needed.'
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return `I can help with:\n• Medical information (BP, diabetes, heart rate, etc.)\n• Your medications (${medications.length} tracked)\n• Reminders & adherence (${reminders.length} active)\n• General health advice\n• Medication interactions\n\nAsk me anything about health!`
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! I'm your AI health assistant. I can answer medical questions, help with your ${medications.length} medications, and provide health advice. What would you like to know?`
    }
    
    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! I\'m here to help with your health questions anytime. Stay healthy!'
    }
    
    // Default response
    return `I'm your AI health assistant! I can answer questions about:\n• Medical values (blood pressure, heart rate, etc.)\n• Your ${medications.length} medications\n• General health topics\n• Medication management\n\nTry asking: "What is normal blood pressure?" or "Tell me about my medications"`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setChatMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use Puter.js AI (unlimited, free, no API key)
      if (window.puter && window.puter.ai) {
        const medContext = medications.length > 0 
          ? `User's medications: ${medications.map(m => `${m.name} (${m.dosage})`).join(', ')}. ` 
          : ''
        
        const prompt = `You are a helpful medical assistant. ${medContext}Answer this question briefly in 2-3 sentences: "${currentMessage}"`
        
        const response = await window.puter.ai.chat(prompt)
        
        // Parse Puter.js response correctly
        let aiText = ''
        
        if (response?.result?.message?.content) {
          // Handle Claude/Anthropic format
          const content = response.result.message.content
          if (Array.isArray(content) && content[0]?.text) {
            aiText = content[0].text
          } else if (typeof content === 'string') {
            aiText = content
          }
        } else if (response?.message?.content) {
          // Alternative format
          const content = response.message.content
          if (Array.isArray(content) && content[0]?.text) {
            aiText = content[0].text
          } else if (typeof content === 'string') {
            aiText = content
          }
        } else if (response?.message) {
          aiText = response.message
        } else if (response?.choices?.[0]?.message?.content) {
          aiText = response.choices[0].message.content
        } else if (response?.text) {
          aiText = response.text
        } else if (typeof response === 'string') {
          aiText = response
        }
        
        if (aiText && aiText.trim()) {
          setChatMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: String(aiText).trim(),
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          }])
          setIsLoading(false)
          return
        }
      }
      
      throw new Error('Puter.js not available')
    } catch (error) {
      console.log('Using knowledge base:', error.message)
      // Fallback to comprehensive medical knowledge base
      setTimeout(() => {
        const response = getEnhancedResponse(currentMessage)
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: String(response),
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }])
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
            <Brain className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
            AI Health Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Personalized insights and AI assistant</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-bg rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Health Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{medications.length}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Medications</div>
            </div>
            <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{reminders.length}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Reminders</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{medications.filter(m => m.stock <= 7).length}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Low Stock</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card-bg rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                Smart Insights
              </h2>
              <button onClick={refreshInsights} disabled={isRefreshing} className="px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center text-sm sm:text-base">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div key={insight.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className={`${insight.color} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${insight.color}`}>
                      <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 dark:text-white font-semibold mb-1">{insight.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card-bg rounded-2xl p-4 sm:p-6 flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                AI Assistant
              </h2>
              {chatMessages.length > 0 && (
                <button onClick={() => setChatMessages([])} className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex items-center text-sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2">Ask me anything about health!</p>
                  <p className="text-xs">Try: "What is normal blood pressure?"</p>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'}`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask about your health..." className="flex-1 px-4 py-3 bg-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm" disabled={isLoading} />
              <button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()} className="px-4 py-3 btn-primary rounded-xl disabled:opacity-50">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AIInsights
