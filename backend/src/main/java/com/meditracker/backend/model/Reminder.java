package com.meditracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "reminders")
public class Reminder {
    
    @Id
    private String id;
    
    @NotBlank(message = "Medication ID is required")
    private String medicationId;
    
    @NotBlank(message = "Medication name is required")
    private String medicationName;
    
    @NotNull(message = "Time is required")
    private LocalTime time;
    
    @NotNull(message = "Days are required")
    private List<String> days;
    
    private boolean enabled = true;
    private boolean soundEnabled = true;
    private String userId;
    private LocalDateTime lastTaken;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Reminder() {}
    
    public Reminder(String medicationId, String medicationName, LocalTime time, List<String> days, String userId) {
        this.medicationId = medicationId;
        this.medicationName = medicationName;
        this.time = time;
        this.days = days;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getMedicationId() { return medicationId; }
    public void setMedicationId(String medicationId) { this.medicationId = medicationId; }
    
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
    
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    
    public List<String> getDays() { return days; }
    public void setDays(List<String> days) { this.days = days; }
    
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    
    public boolean isSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(boolean soundEnabled) { this.soundEnabled = soundEnabled; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getLastTaken() { return lastTaken; }
    public void setLastTaken(LocalDateTime lastTaken) { this.lastTaken = lastTaken; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}