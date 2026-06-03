package com.meditracker.backend.service;

import com.meditracker.backend.model.Reminder;
import com.meditracker.backend.repository.ReminderRepository;
import com.meditracker.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {
    
    @Autowired
    private ReminderRepository reminderRepository;
    
    public List<Reminder> getRemindersByUserId(String userId) {
        return reminderRepository.findByUserId(userId);
    }
    
    public Reminder getReminderById(String id, String userId) {
        return reminderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));
    }
    
    public Reminder createReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }
    
    public Reminder updateReminder(String id, Reminder reminderDetails, String userId) {
        Reminder reminder = getReminderById(id, userId);
        
        reminder.setMedicationId(reminderDetails.getMedicationId());
        reminder.setMedicationName(reminderDetails.getMedicationName());
        reminder.setTime(reminderDetails.getTime());
        reminder.setDays(reminderDetails.getDays());
        reminder.setEnabled(reminderDetails.isEnabled());
        reminder.setSoundEnabled(reminderDetails.isSoundEnabled());
        
        return reminderRepository.save(reminder);
    }
    
    public void deleteReminder(String id, String userId) {
        Reminder reminder = getReminderById(id, userId);
        reminderRepository.delete(reminder);
    }
    
    public Reminder toggleReminder(String id, String userId) {
        Reminder reminder = getReminderById(id, userId);
        reminder.setEnabled(!reminder.isEnabled());
        return reminderRepository.save(reminder);
    }
    
    public Reminder markAsTaken(String id, String userId) {
        Reminder reminder = getReminderById(id, userId);
        reminder.setLastTaken(LocalDateTime.now());
        return reminderRepository.save(reminder);
    }
    
    public Reminder undoTaken(String id, String userId) {
        Reminder reminder = getReminderById(id, userId);
        reminder.setLastTaken(null);
        return reminderRepository.save(reminder);
    }
}