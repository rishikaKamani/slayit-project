package com.slayit.controller;

import com.slayit.dto.*;
import com.slayit.service.HabitService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits")
public class HabitController {
    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(@Valid @RequestBody HabitRequest request, Principal principal) {
        return ResponseEntity.ok(habitService.createHabit(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getHabits(Principal principal) {
        return ResponseEntity.ok(habitService.getHabits(principal.getName()));
    }

    @PostMapping("/{habitId}/log")
    public ResponseEntity<HabitLogResponse> logHabit(@PathVariable("habitId") Long habitId,
                                                     @Valid @RequestBody HabitLogRequest request,
                                                     Principal principal) {
        return ResponseEntity.ok(habitService.logHabit(habitId, request, principal.getName()));
    }

    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(@PathVariable("habitId") Long habitId, Principal principal) {
        habitService.deleteHabit(habitId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
