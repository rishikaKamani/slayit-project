package com.slayit.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.slayit.model.HabitStatus;
import java.time.LocalDate;
import java.util.List;

public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private Integer durationDays;
    private Integer currentStreak;
    private Integer longestStreak;
    private Long totalLogs;
    private HabitStatus todayStatus;
    private String rewardMessage;
    private List<HabitDayResponse> days;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate createdDate;

    private Boolean timeBound;
    private String targetTime;
    private Integer graceMinutes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }

    public Long getTotalLogs() { return totalLogs; }
    public void setTotalLogs(Long totalLogs) { this.totalLogs = totalLogs; }

    public HabitStatus getTodayStatus() { return todayStatus; }
    public void setTodayStatus(HabitStatus todayStatus) { this.todayStatus = todayStatus; }

    public String getRewardMessage() { return rewardMessage; }
    public void setRewardMessage(String rewardMessage) { this.rewardMessage = rewardMessage; }

    public List<HabitDayResponse> getDays() { return days; }
    public void setDays(List<HabitDayResponse> days) { this.days = days; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public Boolean getTimeBound() { return timeBound; }
    public void setTimeBound(Boolean timeBound) { this.timeBound = timeBound; }

    public String getTargetTime() { return targetTime; }
    public void setTargetTime(String targetTime) { this.targetTime = targetTime; }

    public Integer getGraceMinutes() { return graceMinutes; }
    public void setGraceMinutes(Integer graceMinutes) { this.graceMinutes = graceMinutes; }
}