package com.slayit.repository;

import com.slayit.model.Habit;
import com.slayit.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserOrderByCreatedDateDesc(User user);
}
