package com.meditracker.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AIConfig {
    
    @Value("${ai.api.url:https://api.openai.com/v1/chat/completions}")
    private String aiApiUrl;
    
    @Value("${ai.api.key:}")
    private String aiApiKey;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public String getAiApiUrl() {
        return aiApiUrl;
    }
    
    public String getAiApiKey() {
        return aiApiKey;
    }
}