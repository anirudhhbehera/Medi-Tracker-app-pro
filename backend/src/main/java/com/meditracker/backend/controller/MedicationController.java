package com.meditracker.backend.controller;

import com.meditracker.backend.model.Medication;
import com.meditracker.backend.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class MedicationController {
    
    @Autowired
    private MedicationService medicationService;
    
    @GetMapping
    public ResponseEntity<List<Medication>> getAllMedications(@RequestParam String userId) {
        List<Medication> medications = medicationService.getMedicationsByUserId(userId);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Medication> getMedicationById(@PathVariable String id, @RequestParam String userId) {
        Medication medication = medicationService.getMedicationById(id, userId);
        return ResponseEntity.ok(medication);
    }
    
    @PostMapping
    public ResponseEntity<Medication> createMedication(@Valid @RequestBody Medication medication) {
        System.out.println("Received medication: " + medication.getName() + ", time: " + medication.getTime());
        Medication createdMedication = medicationService.createMedication(medication);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMedication);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(
            @PathVariable String id, 
            @Valid @RequestBody Medication medication,
            @RequestParam String userId) {
        Medication updatedMedication = medicationService.updateMedication(id, medication, userId);
        return ResponseEntity.ok(updatedMedication);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMedication(@PathVariable String id, @RequestParam String userId) {
        medicationService.deleteMedication(id, userId);
        return ResponseEntity.ok(Map.of("message", "Medication deleted successfully"));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Medication>> searchMedications(
            @RequestParam String userId,
            @RequestParam String query) {
        List<Medication> medications = medicationService.searchMedications(userId, query);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Medication>> getLowStockMedications(
            @RequestParam String userId,
            @RequestParam(defaultValue = "7") int threshold) {
        List<Medication> medications = medicationService.getLowStockMedications(userId, threshold);
        return ResponseEntity.ok(medications);
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Medication> updateStock(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam int stock) {
        Medication medication = medicationService.updateStock(id, userId, stock);
        return ResponseEntity.ok(medication);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMedicationStats(@RequestParam String userId) {
        Map<String, Object> stats = medicationService.getMedicationStats(userId);
        return ResponseEntity.ok(stats);
    }
}