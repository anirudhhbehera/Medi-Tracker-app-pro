import Medication from '../models/Medication.js';
import Reminder from '../models/Reminder.js';

const generateInsights = async (userId) => {
  const medications = await Medication.find({ userId });
  const reminders = await Reminder.find({ userId });
  const insights = [];

  // Stock alerts
  const lowStock = medications.filter(m => m.stock && m.stock <= 7);
  if (lowStock.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Low Stock Alert',
      description: `${lowStock.length} medication(s) running low: ${lowStock.map(m => m.name).join(', ')}`,
      icon: 'AlertTriangle',
      color: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      priority: 1
    });
  }

  // Adherence tracking
  const today = new Date().toDateString();
  const takenToday = reminders.filter(r => r.lastTaken && new Date(r.lastTaken).toDateString() === today).length;
  const totalActive = reminders.filter(r => r.enabled).length;
  
  if (totalActive > 0) {
    const adherenceRate = Math.round((takenToday / totalActive) * 100);
    insights.push({
      type: adherenceRate >= 80 ? 'success' : 'info',
      title: adherenceRate >= 80 ? 'Excellent Adherence' : 'Good Progress',
      description: `${adherenceRate}% adherence today. ${adherenceRate >= 80 ? "You're doing great!" : 'Keep it up!'}`,
      icon: 'TrendingUp',
      color: adherenceRate >= 80 ? 'bg-green-500/20' : 'bg-blue-500/20',
      iconColor: adherenceRate >= 80 ? 'text-green-400' : 'text-blue-400',
      priority: 1
    });
  }

  // Health tips
  insights.push({
    type: 'success',
    title: 'Daily Health Tip',
    description: 'Take medications with a full glass of water unless directed otherwise. Stay hydrated!',
    icon: 'Sparkles',
    color: 'bg-green-500/20',
    iconColor: 'text-green-400',
    priority: 3
  });

  return insights.sort((a, b) => a.priority - b.priority).slice(0, 4);
};

export const getInsights = async (req, res) => {
  try {
    const insights = await generateInsights(req.params.userId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshInsights = async (req, res) => {
  try {
    const insights = await generateInsights(req.params.userId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
