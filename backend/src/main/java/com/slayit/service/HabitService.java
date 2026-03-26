package com.slayit.service;

import com.slayit.dto.*;
import com.slayit.model.*;
import com.slayit.repository.HabitLogRepository;
import com.slayit.repository.HabitRepository;
import com.slayit.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    public HabitService(HabitRepository habitRepository, HabitLogRepository habitLogRepository, UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.userRepository = userRepository;
    }

    public HabitResponse createHabit(HabitRequest request, String email) {
        User user = getUserByEmail(email);

        Habit habit = new Habit();
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setCategory(request.getCategory());
        habit.setDurationDays(request.getDurationDays());
        habit.setUser(user);

        boolean isTimeBound = Boolean.TRUE.equals(request.getTimeBound());
        habit.setTimeBound(isTimeBound);
        habit.setGraceMinutes(request.getGraceMinutes() != null ? request.getGraceMinutes() : 0);

        if (isTimeBound) {
            if (request.getTargetTime() == null || request.getTargetTime().isBlank()) {
                throw new IllegalArgumentException("Target time is required for time-bound habits");
            }
            habit.setTargetTime(LocalTime.parse(request.getTargetTime()));
        } else {
            habit.setTargetTime(null);
            habit.setGraceMinutes(0);
        }

        Habit savedHabit = habitRepository.save(habit);
        return mapToResponse(savedHabit);
    }

    @Transactional
    public List<HabitResponse> getHabits(String email) {
        User user = getUserByEmail(email);

        return habitRepository.findByUserOrderByCreatedDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HabitLogResponse logHabit(Long habitId, HabitLogRequest request, String email) {
        Habit habit = getOwnedHabit(habitId, email);

        if (request.getDayNumber() == null || request.getDayNumber() < 1 || request.getDayNumber() > habit.getDurationDays()) {
            throw new IllegalArgumentException("Invalid habit day number");
        }

        if (request.getStatus() == HabitStatus.DONE && habit.isTimeBound()) {
            validateTimeBoundHabit(habit);
        }

        LocalDate logDate = habit.getCreatedDate().plusDays(request.getDayNumber() - 1L);

        HabitLog log = habitLogRepository.findByHabitAndLogDate(habit, logDate)
                .orElseGet(HabitLog::new);

        log.setHabit(habit);
        log.setLogDate(logDate);
        log.setStatus(request.getStatus());
        log.setFeedback(generateFeedbackForStatus(request.getStatus(), habit.getCurrentStreak()));

        habitLogRepository.save(log);

        recalculateHabitStats(habit);
        habitRepository.save(habit);

        return new HabitLogResponse(log.getFeedback());
    }

    public DashboardSummaryResponse getDashboardSummary(String email) {
        List<HabitResponse> habits = getHabits(email);

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalHabits(habits.size());
        response.setCompletedToday((int) habits.stream()
                .filter(h -> h.getTodayStatus() == HabitStatus.DONE)
                .count());
        response.setActiveStreaks((int) habits.stream()
                .filter(h -> h.getCurrentStreak() > 0)
                .count());
        response.setMessage(generateDashboardMessage(response.getCompletedToday(), response.getTotalHabits()));
        response.setRewardMessage(generateRewardMessage(habits));

        return response;
    }

    @Transactional
    public PerformanceResponse getPerformance(String email) {
        User user = getUserByEmail(email);
        List<Habit> habits = habitRepository.findByUserOrderByCreatedDateDesc(user);

        LocalDate today = LocalDate.now();
        LocalDate thisWeekStart = today.minusDays(6);
        LocalDate lastWeekStart = today.minusDays(13);
        LocalDate lastWeekEnd = today.minusDays(7);

        int totalCompletedDays = 0;
        int totalTargetDays = 0;
        int thisWeekCompleted = 0;
        int thisWeekExpected = 0;
        int lastWeekCompleted = 0;
        int lastWeekExpected = 0;

        List<PerformanceHabitScoreResponse> habitScores = habits.stream().map(habit -> {
            List<HabitLog> logs = habitLogRepository.findByHabitOrderByLogDateAsc(habit);

            int completedDays = (int) logs.stream()
                    .filter(log -> log.getStatus() == HabitStatus.DONE)
                    .count();

            int targetDays = habit.getDurationDays();

            PerformanceHabitScoreResponse habitScore = new PerformanceHabitScoreResponse();
            habitScore.setHabitId(habit.getId());
            habitScore.setHabitName(habit.getName());
            habitScore.setCategory(habit.getCategory().name());
            habitScore.setCompletedDays(completedDays);
            habitScore.setTargetDays(targetDays);
            habitScore.setScorePercentage(calculatePercentage(completedDays, targetDays));

            return habitScore;
        }).collect(Collectors.toList());

        for (Habit habit : habits) {
            List<HabitLog> logs = habitLogRepository.findByHabitOrderByLogDateAsc(habit);

            int completedDays = (int) logs.stream()
                    .filter(log -> log.getStatus() == HabitStatus.DONE)
                    .count();

            totalCompletedDays += completedDays;
            totalTargetDays += habit.getDurationDays();

            int thisHabitThisWeekExpected = calculateExpectedDaysInRange(habit, thisWeekStart, today);
            int thisHabitLastWeekExpected = calculateExpectedDaysInRange(habit, lastWeekStart, lastWeekEnd);

            int thisHabitThisWeekCompleted = (int) logs.stream()
                    .filter(log -> log.getStatus() == HabitStatus.DONE)
                    .filter(log -> !log.getLogDate().isBefore(thisWeekStart) && !log.getLogDate().isAfter(today))
                    .count();

            int thisHabitLastWeekCompleted = (int) logs.stream()
                    .filter(log -> log.getStatus() == HabitStatus.DONE)
                    .filter(log -> !log.getLogDate().isBefore(lastWeekStart) && !log.getLogDate().isAfter(lastWeekEnd))
                    .count();

            thisWeekExpected += thisHabitThisWeekExpected;
            lastWeekExpected += thisHabitLastWeekExpected;
            thisWeekCompleted += thisHabitThisWeekCompleted;
            lastWeekCompleted += thisHabitLastWeekCompleted;
        }

        Double overallScore = calculatePercentage(totalCompletedDays, totalTargetDays);
        Double thisWeekScore = calculatePercentage(thisWeekCompleted, thisWeekExpected);
        Double lastWeekScore = calculatePercentage(lastWeekCompleted, lastWeekExpected);
        Double improvementPercentage = roundToTwoDecimals(thisWeekScore - lastWeekScore);

        PerformanceResponse response = new PerformanceResponse();
        response.setOverallScore(overallScore);
        response.setThisWeekScore(thisWeekScore);
        response.setLastWeekScore(lastWeekScore);
        response.setImprovementPercentage(improvementPercentage);
        response.setTotalHabits(habits.size());
        response.setTotalCompletedDays(totalCompletedDays);
        response.setTotalTargetDays(totalTargetDays);
        response.setPerformanceMessage(generatePerformanceMessage(overallScore, improvementPercentage, habits.size()));
        response.setHabitScores(habitScores);

        return response;
    }

    private void validateTimeBoundHabit(Habit habit) {
        if (habit.getTargetTime() == null) {
            throw new IllegalArgumentException("This time-bound habit has no target time configured");
        }

        LocalTime now = LocalTime.now();
        LocalTime deadline = habit.getTargetTime().plusMinutes(habit.getGraceMinutes());

        if (now.isAfter(deadline)) {
            String formattedTarget = habit.getTargetTime().format(DateTimeFormatter.ofPattern("HH:mm"));
            String formattedDeadline = deadline.format(DateTimeFormatter.ofPattern("HH:mm"));
            throw new IllegalArgumentException(
                    "Too late. This habit was set for " + formattedTarget + " and valid only until " + formattedDeadline
            );
        }
    }

    private void recalculateHabitStats(Habit habit) {
        List<HabitLog> logs = habitLogRepository.findByHabitOrderByLogDateAsc(habit);

        int longest = 0;
        int running = 0;

        for (HabitLog log : logs) {
            if (log.getStatus() == HabitStatus.DONE) {
                running++;
                longest = Math.max(longest, running);
            } else if (log.getStatus() == HabitStatus.MISSED) {
                running = 0;
            }
        }

        int current = 0;
        for (int i = logs.size() - 1; i >= 0; i--) {
            if (logs.get(i).getStatus() == HabitStatus.DONE) {
                current++;
            } else {
                break;
            }
        }

        habit.setCurrentStreak(current);
        habit.setLongestStreak(longest);
    }

    private String generateFeedbackForStatus(HabitStatus status, int streak) {
        if (status == HabitStatus.DONE) {
            return generateDoneFeedback(streak + 1);
        }
        if (status == HabitStatus.MISSED) {
            return generateMissedFeedback();
        }
        return "Updated.";
    }

    private HabitResponse mapToResponse(Habit habit) {
        HabitResponse response = new HabitResponse();
        response.setId(habit.getId());
        response.setName(habit.getName());
        response.setDescription(habit.getDescription());
        response.setCategory(habit.getCategory().name());
        response.setDurationDays(habit.getDurationDays());
        response.setCurrentStreak(habit.getCurrentStreak());
        response.setLongestStreak(habit.getLongestStreak());
        response.setCreatedDate(habit.getCreatedDate().toString());

        response.setTimeBound(habit.isTimeBound());
        response.setTargetTime(habit.getTargetTime() != null ? habit.getTargetTime().toString() : null);
        response.setGraceMinutes(habit.getGraceMinutes());

        List<HabitLog> logs = habitLogRepository.findByHabitOrderByLogDateAsc(habit);

        response.setTotalLogs((long) logs.size());

        response.setTodayStatus(
                habitLogRepository.findByHabitAndLogDate(habit, LocalDate.now())
                        .map(HabitLog::getStatus)
                        .orElse(HabitStatus.PENDING)
        );

        response.setRewardMessage(
                habit.getCurrentStreak() >= 7
                        ? "Seven-day streak unlocked. Look at you being annoyingly disciplined."
                        : null
        );

        response.setDays(buildDays(habit, logs));
        return response;
    }

    private List<HabitDayResponse> buildDays(Habit habit, List<HabitLog> logs) {
        int duration = habit.getDurationDays();
        List<HabitDayResponse> days = new ArrayList<>();

        for (int i = 0; i < duration; i++) {
            days.add(new HabitDayResponse(i + 1, "pending"));
        }

        for (HabitLog log : logs) {
            long diff = ChronoUnit.DAYS.between(habit.getCreatedDate(), log.getLogDate());
            if (diff >= 0 && diff < duration) {
                int index = (int) diff;
                days.set(index, new HabitDayResponse(index + 1, log.getStatus().name().toLowerCase()));
            }
        }

        return days;
    }

    private int calculateExpectedDaysInRange(Habit habit, LocalDate rangeStart, LocalDate rangeEnd) {
        LocalDate habitStart = habit.getCreatedDate();
        LocalDate habitEnd = habit.getCreatedDate().plusDays(habit.getDurationDays() - 1L);

        LocalDate effectiveStart = rangeStart.isAfter(habitStart) ? rangeStart : habitStart;
        LocalDate effectiveEnd = rangeEnd.isBefore(habitEnd) ? rangeEnd : habitEnd;

        if (effectiveStart.isAfter(effectiveEnd)) {
            return 0;
        }

        return (int) (ChronoUnit.DAYS.between(effectiveStart, effectiveEnd) + 1);
    }

    private Double calculatePercentage(int numerator, int denominator) {
        if (denominator <= 0) {
            return 0.0;
        }
        return roundToTwoDecimals((numerator * 100.0) / denominator);
    }

    private Double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String generateDoneFeedback(int streak) {
        if (streak >= 30) {
            return "Thirty days straight. Fine, that's actually impressive.";
        }
        if (streak >= 7) {
            return "Seven-day streak. You might finally be serious.";
        }
        return "Logged. Bare minimum done, but done is done.";
    }

    private String generateMissedFeedback() {
        return "Marked missed. Cute. Try not to make this your personality.";
    }

    private String generateDashboardMessage(int completedToday, int totalHabits) {
        if (totalHabits == 0) {
            return "No habits yet. Planning to improve without tracking is just fantasy.";
        }
        if (completedToday == totalHabits) {
            return "Everything is done today. Suspiciously competent.";
        }
        if (completedToday == 0) {
            return "Nothing done yet. A bold strategy, unfortunately.";
        }
        return "Some progress is better than your usual excuses. Keep going.";
    }

    private String generateRewardMessage(List<HabitResponse> habits) {
        int bestStreak = habits.stream()
                .map(HabitResponse::getCurrentStreak)
                .max(Integer::compareTo)
                .orElse(0);

        if (bestStreak >= 30) {
            return "30-day streak unlocked. Main character energy achieved.";
        }
        if (bestStreak >= 7) {
            return "7-day streak unlocked. Momentum is real now.";
        }
        return "Rewards kick in when effort becomes a pattern, not a random event.";
    }

    private String generatePerformanceMessage(Double overallScore, Double improvementPercentage, int totalHabits) {
        if (totalHabits == 0) {
            return "No habits, no score, no illusion of progress either.";
        }
        if (overallScore >= 80) {
            return "Strong consistency. Annoyingly impressive, honestly.";
        }
        if (improvementPercentage > 0) {
            return "This week is better than last week. Finally, evidence of growth.";
        }
        if (improvementPercentage < 0) {
            return "Performance dipped this week. Your excuses are getting stronger than your habits.";
        }
        return "Stable, but not exactly inspiring. Keep moving.";
    }

    @Transactional
    public void deleteHabit(Long habitId, String email) {
        Habit habit = getOwnedHabit(habitId, email);
        habitRepository.delete(habit);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Habit getOwnedHabit(Long habitId, String email) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));

        if (!habit.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("You do not own this habit");
        }

        return habit;
    }
}