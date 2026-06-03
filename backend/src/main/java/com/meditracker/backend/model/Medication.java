package com.meditracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "medications")
public class Medication {
    
    @Id
    private String id;
    
    @NotBlank(message = "Medication name is required")
    private String name;
    
    @NotBlank(message = "Dosage is required")
    private String dosage;
    
    private String frequency;
    private String time;
    private List<String> times;
    private String instructions;
    private String color;
    
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    private String userId;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Medication() {}
    
    public Medication(String name, String dosage, String frequency, String time, List<String> times, Integer stock, String userId) {
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.time = time;
        this.times = times;
        this.stock = stock;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    
    public List<String> getTimes() { return times; }
    public void setTimes(List<String> times) { this.times = times; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}