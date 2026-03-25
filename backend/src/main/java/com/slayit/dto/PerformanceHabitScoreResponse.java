package com.slayit.dto;

public class PerformanceHabitScoreResponse {
    private Long habitId;
    private String habitName;
    private String category;
    private Integer completedDays;
    private Integer targetDays;
    private Double scorePercentage;

    public Long getHabitId() { return habitId; }
    public void setHabitId(Long habitId) { this.habitId = habitId; }

    public String getHabitName() { return habitName; }
    public void setHabitName(String habitName) { this.habitName = habitName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCompletedDays() { return completedDays; }
    public void setCompletedDays(Integer completedDays) { this.completedDays = completedDays; }

    public Integer getTargetDays() { return targetDays; }
    public void setTargetDays(Integer targetDays) { this.targetDays = targetDays; }

    public Double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; }
}