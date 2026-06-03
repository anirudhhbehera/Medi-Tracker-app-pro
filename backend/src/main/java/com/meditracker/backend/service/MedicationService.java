package com.meditracker.backend.service;

import com.meditracker.backend.model.Medication;
import com.meditracker.backend.repository.MedicationRepository;
import com.meditracker.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class MedicationService {
    
    @Autowired
    private MedicationRepository medicationRepository;
    
    public List<Medication> getMedicationsByUserId(String userId) {
        return medicationRepository.findByUserId(userId);
    }
    
    public Medication getMedicationById(String id, String userId) {
        return medicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found with id: " + id));
    }
    
    public Medication createMedication(Medication medication) {
        return medicationRepository.save(medication);
    }
    
    public Medication updateMedication(String id, Medication medicationDetails, String userId) {
        Medication medication = getMedicationById(id, userId);
        
        medication.setName(medicationDetails.getName());
        medication.setDosage(medicationDetails.getDosage());
        medication.setFrequency(medicationDetails.getFrequency());
        medication.setTime(medicationDetails.getTime());
        medication.setTimes(medicationDetails.getTimes());
        medication.setInstructions(medicationDetails.getInstructions());
        medication.setColor(medicationDetails.getColor());
        medication.setStock(medicationDetails.getStock());
        
        return medicationRepository.save(medication);
    }
    
    public void deleteMedication(String id, String userId) {
        Medication medication = getMedicationById(id, userId);
        medicationRepository.delete(medication);
    }
    
    public List<Medication> searchMedications(String userId, String query) {
        return medicationRepository.findByUserIdAndNameContainingIgnoreCase(userId, query);
    }
    
    public List<Medication> getLowStockMedications(String userId, int threshold) {
        return medicationRepository.findLowStockMedications(userId, threshold);
    }
    
    public Medication updateStock(String id, String userId, int stock) {
        Medication medication = getMedicationById(id, userId);
        medication.setStock(stock);
        return medicationRepository.save(medication);
    }
    
    public Map<String, Object> getMedicationStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        List<Medication> medications = getMedicationsByUserId(userId);
        List<Medication> lowStockMedications = getLowStockMedications(userId, 7);
        
        stats.put("totalMedications", medications.size());
        stats.put("lowStockCount", lowStockMedications.size());
        stats.put("totalStock", medications.stream().mapToInt(m -> m.getStock() != null ? m.getStock() : 0).sum());
        
        return stats;
    }
}