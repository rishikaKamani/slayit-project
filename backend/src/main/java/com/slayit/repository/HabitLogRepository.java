package com.slayit.repository;

import com.slayit.model.Habit;
import com.slayit.model.HabitLog;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByHabitAndLogDate(Habit habit, LocalDate logDate);
    List<HabitLog> findByHabitOrderByLogDateAsc(Habit habit);
    long countByHabit(Habit habit);
}