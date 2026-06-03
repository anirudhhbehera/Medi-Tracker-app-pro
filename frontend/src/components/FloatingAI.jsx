import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, X, Loader2 } from 'lucide-react'

const FloatingAI = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load Puter.js for unlimited AI
    if (!window.puter) {
      const script = document.createElement('script')
      script.src = 'https://js.puter.com/v2/'
      script.async = true
      script.onload = () => console.log('Puter.js loaded!')
      document.head.appendChild(script)
    }
  }, [])

  const getPersonalizedResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    const { medications = [], reminders = [] } = userData || {}
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      if (medications.length > 0) {
        return `You're managing ${medications.length} medication(s): ${medications.map(m => m.name).join(', ')}. Keep up the good work!`
      }
      return "You haven't added any medications yet. Start by adding them in the Medications page."
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('refill')) {
      const lowStock = medications.filter(m => m.stock <= 7)
      if (lowStock.length > 0) {
        return `⚠️ Low stock alert: ${lowStock.map(m => `${m.name} (${m.stock} left)`).join(', ')}. Time to refill!`
      }
      return 'All your medications are well-stocked. Great planning!'
    }
    
    if (lowerMessage.includes('reminder')) {
      return `You have ${reminders.length} reminder(s) set up. ${reminders.length > 0 ? 'Stay consistent!' : 'Add reminders to never miss a dose.'}`
    }
    
    if (lowerMessage.includes('help')) {
      return `I can help you with:\n• Medication information\n• Stock levels and refills\n• Reminder management\n• Adherence tracking\n\nJust ask me anything!`
    }
    
    return `I'm your health assistant! I can help with medications (${medications.length}), reminders (${reminders.length}), and health tips. What would you like to know?`
  }

  const handleSend = async () => {
    if (!message.trim() || isLoading) return
    
    const userMessage = message
    setMessage('')
    setChatHistory(prev => [...prev, { 
      type: 'user', 
      text: userMessage, 
      time: new Date().toLocaleTimeString() 
    }])
    setIsLoading(true)
    
    try {
      // Use Puter.js AI (unlimited, free)
      if (window.puter && window.puter.ai) {
        const { medications = [], reminders = [] } = userData || {}
        const context = medications.length > 0 
          ? `User has ${medications.length} medications: ${medications.map(m => m.name).join(', ')}. ` 
          : ''
        
        const prompt = `You are a helpful medical assistant. ${context}Answer briefly: "${userMessage}"`
        
        const response = await window.puter.ai.chat(prompt)
        
        // Parse Puter.js response correctly
        let text = ''
        
        if (response?.result?.message?.content) {
          // Handle Claude/Anthropic format
          const content = response.result.message.content
          if (Array.isArray(content) && content[0]?.text) {
            text = content[0].text
          } else if (typeof content === 'string') {
            text = content
          }
        } else if (response?.message?.content) {
          // Alternative format
          const content = response.message.content
          if (Array.isArray(content) && content[0]?.text) {
            text = content[0].text
          } else if (typeof content === 'string') {
            text = content
          }
        } else if (response?.message) {
          text = response.message
        } else if (response?.choices?.[0]?.message?.content) {
          text = response.choices[0].message.content
        } else if (response?.text) {
          text = response.text
        } else if (typeof response === 'string') {
          text = response
        }
        
        if (text && text.trim()) {
          setChatHistory(prev => [...prev, { 
            type: 'ai', 
            text: String(text).trim(), 
            time: new Date().toLocaleTimeString() 
          }])
          setIsLoading(false)
          return
        }
      }
      
      throw new Error('Puter.js not available')
    } catch (error) {
      console.log('Using knowledge base:', error.message)
      setTimeout(() => {
        const response = getPersonalizedResponse(userMessage)
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          text: String(response), 
          time: new Date().toLocaleTimeString() 
        }])
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl drop-shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Health Assistant
              </h3>
              <button onClick={() => { setIsOpen(false); setChatHistory([]); }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  Ask me about your medications!
                </div>
              )}
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    chat.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}>
                    <p className="whitespace-pre-line">{chat.text}</p>
                    <p className="text-xs opacity-70 mt-1">{chat.time}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Ask about your health..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAI