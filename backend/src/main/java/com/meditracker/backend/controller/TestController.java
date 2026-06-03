package com.meditracker.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class TestController {
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "Backend is running");
    }
    
    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody Map<String, Object> data) {
        return Map.of("received", data, "timestamp", System.currentTimeMillis());
    }
}