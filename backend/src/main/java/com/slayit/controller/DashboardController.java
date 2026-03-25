package com.slayit.controller;

import com.slayit.dto.DashboardSummaryResponse;
import com.slayit.dto.PerformanceResponse;
import com.slayit.service.HabitService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final HabitService habitService;

    public DashboardController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(Principal principal) {
        return ResponseEntity.ok(habitService.getDashboardSummary(principal.getName()));
    }

    @GetMapping("/performance")
    public ResponseEntity<PerformanceResponse> getPerformance(Principal principal) {
        return ResponseEntity.ok(habitService.getPerformance(principal.getName()));
    }
}