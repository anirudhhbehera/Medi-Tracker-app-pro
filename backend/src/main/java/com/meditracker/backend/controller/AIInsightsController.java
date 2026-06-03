package com.meditracker.backend.controller;

import com.meditracker.backend.service.AIInsightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai-insights")
@CrossOrigin(origins = "*")
public class AIInsightsController {
    
    @Autowired
    private AIInsightsService aiInsightsService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getInsights(@PathVariable String userId) {
        List<Map<String, Object>> insights = aiInsightsService.generateInsights(userId);
        return ResponseEntity.ok(insights);
    }
    
    @PostMapping("/{userId}/refresh")
    public ResponseEntity<List<Map<String, Object>>> refreshInsights(@PathVariable String userId) {
        List<Map<String, Object>> insights = aiInsightsService.generateInsights(userId);
        return ResponseEntity.ok(insights);
    }
    
    @PostMapping("/{userId}/ai-powered")
    public ResponseEntity<Map<String, Object>> getAIPoweredInsights(@PathVariable String userId) {
        try {
            List<Map<String, Object>> insights = aiInsightsService.generateInsights(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "insights", insights,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage(),
                "insights", List.of()
            ));
        }
    }
}