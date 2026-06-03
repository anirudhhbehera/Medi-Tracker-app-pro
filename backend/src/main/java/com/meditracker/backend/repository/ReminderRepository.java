package com.meditracker.backend.repository;

import com.meditracker.backend.model.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends MongoRepository<Reminder, String> {
    
    List<Reminder> findByUserId(String userId);
    
    List<Reminder> findByUserIdAndEnabled(String userId, boolean enabled);
    
    Optional<Reminder> findByIdAndUserId(String id, String userId);
    
    List<Reminder> findByMedicationId(String medicationId);
    
    @Query("{ 'userId': ?0, 'enabled': true, 'time': { $gte: ?1, $lte: ?2 } }")
    List<Reminder> findActiveRemindersByTimeRange(String userId, LocalTime startTime, LocalTime endTime);
    
    @Query("{ 'userId': ?0, 'enabled': true, 'days': { $in: [?1] } }")
    List<Reminder> findActiveRemindersByDay(String userId, String day);
    
    long countByUserIdAndEnabled(String userId, boolean enabled);
    
    void deleteByIdAndUserId(String id, String userId);
    
    void deleteByMedicationId(String medicationId);
}