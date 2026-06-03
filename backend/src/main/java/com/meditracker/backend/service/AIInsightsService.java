package com.meditracker.backend.service;

import com.meditracker.backend.model.Medication;
import com.meditracker.backend.model.Reminder;
import com.meditracker.backend.config.AIConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIInsightsService {
    
    @Autowired
    private MedicationService medicationService;
    
    @Autowired
    private ReminderService reminderService;
    
    @Autowired
    private AIConfig aiConfig;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<Map<String, Object>> generateInsights(String userId) {
        // Only allow AI API calls for user1
        if (!"user1".equals(userId)) {
            return generateFallbackInsights(userId);
        }
        
        try {
            // Fetch data via API calls
            String medicationsJson = fetchMedicationsAsJson(userId);
            String remindersJson = fetchRemindersAsJson(userId);
            
            // Make AI API call with context
            String aiResponse = callAIWithContext(medicationsJson, remindersJson, userId);
            
            // Parse AI response or fallback to existing logic
            return parseAIResponse(aiResponse);
        } catch (Exception e) {
            // Fallback to existing insights
            return generateFallbackInsights(userId);
        }
    }
    
    private String fetchMedicationsAsJson(String userId) throws Exception {
        List<Medication> medications = medicationService.getMedicationsByUserId(userId);
        return objectMapper.writeValueAsString(medications);
    }
    
    private String fetchRemindersAsJson(String userId) throws Exception {
        List<Reminder> reminders = reminderService.getRemindersByUserId(userId);
        return objectMapper.writeValueAsString(reminders);
    }
    
    private String callAIWithContext(String medicationsJson, String remindersJson, String userId) {
        if (aiConfig.getAiApiKey().isEmpty() || "your-api-key-here".equals(aiConfig.getAiApiKey())) {
            return "AI service not configured";
        }
        
        String prompt = "Analyze this medication data and provide 2-3 brief health insights:\n" +
                       "Medications: " + medicationsJson + "\n" +
                       "Reminders: " + remindersJson + "\n" +
                       "Focus on adherence, timing, and safety. Keep responses under 100 words each.";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(aiConfig.getAiApiKey());
        
        Map<String, Object> requestBody = Map.of(
            "model", "gpt-3.5-turbo",
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "max_tokens", 300,
            "temperature", 0.7
        );
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(aiConfig.getAiApiUrl(), request, Map.class);
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "AI analysis temporarily unavailable: " + e.getMessage();
        }
    }
    
    private List<Map<String, Object>> parseAIResponse(String aiResponse) {
        // Simple parsing - enhance as needed
        Map<String, Object> insight = new HashMap<>();
        insight.put("type", "info");
        insight.put("title", "AI Health Insight");
        insight.put("description", aiResponse);
        insight.put("icon", "Brain");
        insight.put("color", "bg-blue-500/20");
        insight.put("iconColor", "text-blue-400");
        insight.put("priority", 1);
        return List.of(insight);
    }
    
    private List<Map<String, Object>> generateFallbackInsights(String userId) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        List<Medication> medications = medicationService.getMedicationsByUserId(userId);
        List<Reminder> reminders = reminderService.getRemindersByUserId(userId);
        
        // Generate all types of insights
        insights.addAll(generateStockInsights(medications));
        insights.addAll(generateAdherenceInsights(reminders));
        insights.addAll(generateFrequencyInsights(medications));
        insights.addAll(generateTimingInsights(reminders));
        insights.addAll(generateTrendInsights(medications, reminders));
        insights.addAll(generateHealthTips(medications, reminders));
        
        // Sort by priority and return top insights
        return insights.stream()
            .sorted((a, b) -> Integer.compare((Integer) a.get("priority"), (Integer) b.get("priority")))
            .limit(4)
            .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> generateStockInsights(List<Medication> medications) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Low stock alerts
        List<Medication> lowStock = medications.stream()
            .filter(m -> m.getStock() != null && m.getStock() <= 7)
            .collect(Collectors.toList());
            
        if (!lowStock.isEmpty()) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "warning");
            insight.put("title", "Low Stock Alert");
            insight.put("description", String.format("%d medication(s) running low: %s", 
                lowStock.size(), 
                lowStock.stream().map(Medication::getName).collect(Collectors.joining(", "))));
            insight.put("icon", "AlertTriangle");
            insight.put("color", "bg-yellow-500/20");
            insight.put("iconColor", "text-yellow-400");
            insight.put("priority", 1);
            insights.add(insight);
        }
        
        // Stock optimization
        List<Medication> wellStocked = medications.stream()
            .filter(m -> m.getStock() != null && m.getStock() > 30)
            .collect(Collectors.toList());
            
        if (!wellStocked.isEmpty()) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "success");
            insight.put("title", "Well Stocked");
            insight.put("description", String.format("Great job! %d medications are well-stocked for the month ahead.", wellStocked.size()));
            insight.put("icon", "TrendingUp");
            insight.put("color", "bg-green-500/20");
            insight.put("iconColor", "text-green-400");
            insight.put("priority", 3);
            insights.add(insight);
        }
        
        return insights;
    }
    
    private List<Map<String, Object>> generateAdherenceInsights(List<Reminder> reminders) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Calculate adherence based on last taken times
        long takenToday = reminders.stream()
            .filter(r -> r.getLastTaken() != null)
            .filter(r -> ChronoUnit.DAYS.between(r.getLastTaken().toLocalDate(), LocalDateTime.now().toLocalDate()) == 0)
            .count();
            
        long totalActive = reminders.stream()
            .filter(Reminder::isEnabled)
            .count();
            
        if (totalActive > 0) {
            double adherenceRate = (double) takenToday / totalActive * 100;
            
            Map<String, Object> insight = new HashMap<>();
            if (adherenceRate >= 80) {
                insight.put("type", "success");
                insight.put("title", "Excellent Adherence");
                insight.put("description", String.format("%.0f%% adherence today! You're doing great with your medication routine.", adherenceRate));
                insight.put("icon", "TrendingUp");
                insight.put("color", "bg-green-500/20");
                insight.put("iconColor", "text-green-400");
            } else if (adherenceRate >= 60) {
                insight.put("type", "info");
                insight.put("title", "Good Progress");
                insight.put("description", String.format("%.0f%% adherence today. Consider setting more reminders to improve consistency.", adherenceRate));
                insight.put("icon", "Brain");
                insight.put("color", "bg-blue-500/20");
                insight.put("iconColor", "text-blue-400");
            } else {
                insight.put("type", "warning");
                insight.put("title", "Adherence Needs Attention");
                insight.put("description", String.format("%.0f%% adherence today. Let's work on building a consistent routine.", adherenceRate));
                insight.put("icon", "AlertTriangle");
                insight.put("color", "bg-yellow-500/20");
                insight.put("iconColor", "text-yellow-400");
            }
            insight.put("priority", 1);
            insights.add(insight);
        }
        
        return insights;
    }
    
    private List<Map<String, Object>> generateFrequencyInsights(List<Medication> medications) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Analyze medication frequencies
        Map<String, Long> frequencyCount = medications.stream()
            .filter(m -> m.getFrequency() != null)
            .collect(Collectors.groupingBy(Medication::getFrequency, Collectors.counting()));
            
        String mostCommon = frequencyCount.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
            
        if (mostCommon != null && frequencyCount.get(mostCommon) > 1) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "info");
            insight.put("title", "Medication Pattern Detected");
            insight.put("description", String.format("Most of your medications are %s. Consider grouping them for easier management.", mostCommon.toLowerCase()));
            insight.put("icon", "Brain");
            insight.put("color", "bg-blue-500/20");
            insight.put("iconColor", "text-blue-400");
            insight.put("priority", 2);
            insights.add(insight);
        }
        
        return insights;
    }
    
    private List<Map<String, Object>> generateTimingInsights(List<Reminder> reminders) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Analyze reminder timing patterns
        Map<Integer, Long> hourDistribution = reminders.stream()
            .filter(r -> r.getTime() != null)
            .collect(Collectors.groupingBy(r -> r.getTime().getHour(), Collectors.counting()));
            
        // Find peak hours
        Optional<Map.Entry<Integer, Long>> peakHour = hourDistribution.entrySet().stream()
            .max(Map.Entry.comparingByValue());
            
        if (peakHour.isPresent() && peakHour.get().getValue() > 1) {
            int hour = peakHour.get().getKey();
            String timeOfDay = getTimeOfDay(hour);
            
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "info");
            insight.put("title", "Optimal Timing Pattern");
            insight.put("description", String.format("You have %d medications scheduled for %s. This timing works well for routine building.", 
                peakHour.get().getValue(), timeOfDay));
            insight.put("icon", "Brain");
            insight.put("color", "bg-blue-500/20");
            insight.put("iconColor", "text-blue-400");
            insight.put("priority", 2);
            insights.add(insight);
        }
        
        return insights;
    }
    
    private List<Map<String, Object>> generateTrendInsights(List<Medication> medications, List<Reminder> reminders) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Recent activity insights
        long recentMedications = medications.stream()
            .filter(m -> m.getCreatedAt() != null)
            .filter(m -> ChronoUnit.DAYS.between(m.getCreatedAt().toLocalDate(), LocalDateTime.now().toLocalDate()) <= 7)
            .count();
            
        if (recentMedications > 0) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "info");
            insight.put("title", "Recent Activity");
            insight.put("description", String.format("You've added %d new medication(s) this week. Great job staying organized!", recentMedications));
            insight.put("icon", "Sparkles");
            insight.put("color", "bg-purple-500/20");
            insight.put("iconColor", "text-purple-400");
            insight.put("priority", 2);
            insights.add(insight);
        }
        
        // Consistency insights
        long enabledReminders = reminders.stream()
            .filter(Reminder::isEnabled)
            .count();
            
        if (enabledReminders == reminders.size() && !reminders.isEmpty()) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "success");
            insight.put("title", "Consistency Champion");
            insight.put("description", "All your reminders are active! This consistency will help build strong medication habits.");
            insight.put("icon", "TrendingUp");
            insight.put("color", "bg-green-500/20");
            insight.put("iconColor", "text-green-400");
            insight.put("priority", 2);
            insights.add(insight);
        }
        
        return insights;
    }
    
    private List<Map<String, Object>> generateHealthTips(List<Medication> medications, List<Reminder> reminders) {
        List<Map<String, Object>> insights = new ArrayList<>();
        
        // Medication interaction tips
        if (medications.size() > 2) {
            Map<String, Object> insight = new HashMap<>();
            insight.put("type", "info");
            insight.put("title", "Medication Safety Tip");
            insight.put("description", "With multiple medications, always inform your doctor about all drugs you're taking to avoid interactions.");
            insight.put("icon", "Brain");
            insight.put("color", "bg-blue-500/20");
            insight.put("iconColor", "text-blue-400");
            insight.put("priority", 3);
            insights.add(insight);
        }
        
        // Hydration tip
        Map<String, Object> hydrationTip = new HashMap<>();
        hydrationTip.put("type", "success");
        hydrationTip.put("title", "Daily Health Tip");
        hydrationTip.put("description", "Take medications with a full glass of water unless directed otherwise. Stay hydrated throughout the day!");
        hydrationTip.put("icon", "Sparkles");
        hydrationTip.put("color", "bg-green-500/20");
        hydrationTip.put("iconColor", "text-green-400");
        hydrationTip.put("priority", 4);
        insights.add(hydrationTip);
        
        return insights;
    }
    
    private String getTimeOfDay(int hour) {
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        return "night";
    }
}