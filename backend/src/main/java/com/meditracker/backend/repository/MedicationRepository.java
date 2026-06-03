package com.meditracker.backend.repository;

import com.meditracker.backend.model.Medication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicationRepository extends MongoRepository<Medication, String> {
    
    List<Medication> findByUserId(String userId);
    
    List<Medication> findByUserIdAndNameContainingIgnoreCase(String userId, String name);
    
    Optional<Medication> findByIdAndUserId(String id, String userId);
    
    @Query("{ 'userId': ?0, 'stock': { $lte: ?1 } }")
    List<Medication> findLowStockMedications(String userId, int threshold);
    
    long countByUserId(String userId);
    
    void deleteByIdAndUserId(String id, String userId);
}