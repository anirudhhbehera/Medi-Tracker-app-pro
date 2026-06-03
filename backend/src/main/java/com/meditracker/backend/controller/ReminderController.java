package com.meditracker.backend.controller;

import com.meditracker.backend.model.Reminder;
import com.meditracker.backend.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reminders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ReminderController {
    
    @Autowired
    private ReminderService reminderService;
    
    @GetMapping
    public ResponseEntity<List<Reminder>> getAllReminders(@RequestParam String userId) {
        List<Reminder> reminders = reminderService.getRemindersByUserId(userId);
        return ResponseEntity.ok(reminders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminderById(@PathVariable String id, @RequestParam String userId) {
        Reminder reminder = reminderService.getReminderById(id, userId);
        return ResponseEntity.ok(reminder);
    }
    
    @PostMapping
    public ResponseEntity<Reminder> createReminder(@Valid @RequestBody Reminder reminder) {
        Reminder createdReminder = reminderService.createReminder(reminder);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReminder);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(
            @PathVariable String id, 
            @Valid @RequestBody Reminder reminder,
            @RequestParam String userId) {
        Reminder updatedReminder = reminderService.updateReminder(id, reminder, userId);
        return ResponseEntity.ok(updatedReminder);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReminder(@PathVariable String id, @RequestParam String userId) {
        reminderService.deleteReminder(id, userId);
        return ResponseEntity.ok(Map.of("message", "Reminder deleted successfully"));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Reminder> toggleReminder(@PathVariable String id, @RequestParam String userId) {
        Reminder reminder = reminderService.toggleReminder(id, userId);
        return ResponseEntity.ok(reminder);
    }
    
    @PatchMapping("/{id}/taken")
    public ResponseEntity<Reminder> markAsTaken(@PathVariable String id, @RequestParam String userId) {
        Reminder reminder = reminderService.markAsTaken(id, userId);
        return ResponseEntity.ok(reminder);
    }
    
    @PatchMapping("/{id}/undo-taken")
    public ResponseEntity<Reminder> undoTaken(@PathVariable String id, @RequestParam String userId) {
        Reminder reminder = reminderService.undoTaken(id, userId);
        return ResponseEntity.ok(reminder);
    }
}