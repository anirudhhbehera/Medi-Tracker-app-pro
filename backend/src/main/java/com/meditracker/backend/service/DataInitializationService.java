package com.meditracker.backend.service;

import com.meditracker.backend.model.Medication;
import com.meditracker.backend.model.Reminder;
import com.meditracker.backend.repository.MedicationRepository;
import com.meditracker.backend.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private MedicationRepository medicationRepository;
    
    @Autowired
    private ReminderRepository reminderRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (medicationRepository.count() > 0) {
            return; // Data already initialized
        }
        
        // Create sample medications for user123
        String userId = "user123";
        
        List<Medication> sampleMedications = Arrays.asList(
            new Medication("Aspirin", "100mg", "Daily", "08:00", Arrays.asList("08:00"), 30, userId),
            new Medication("Vitamin D", "1000 IU", "Daily", "08:00", Arrays.asList("08:00"), 5, userId), // Low stock
            new Medication("Blood Pressure Med", "10mg", "Twice Daily", "08:00", Arrays.asList("08:00", "20:00"), 15, userId),
            new Medication("Calcium", "500mg", "Daily", "20:00", Arrays.asList("20:00"), 45, userId)
        );
        
        medicationRepository.saveAll(sampleMedications);
        
        // Create sample reminders
        List<Reminder> sampleReminders = Arrays.asList(
            new Reminder(sampleMedications.get(0).getId(), "Aspirin", LocalTime.of(8, 0), 
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), userId),
            new Reminder(sampleMedications.get(1).getId(), "Vitamin D", LocalTime.of(8, 0), 
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), userId),
            new Reminder(sampleMedications.get(2).getId(), "Blood Pressure Med", LocalTime.of(8, 0), 
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), userId),
            new Reminder(sampleMedications.get(2).getId(), "Blood Pressure Med", LocalTime.of(20, 0), 
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), userId),
            new Reminder(sampleMedications.get(3).getId(), "Calcium", LocalTime.of(20, 0), 
                Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), userId)
        );
        
        reminderRepository.saveAll(sampleReminders);
        
        System.out.println("Sample data initialized successfully!");
    }
}