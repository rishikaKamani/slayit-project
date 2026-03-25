package com.slayit.dto;

import java.util.List;

public class PerformanceResponse {
    private Double overallScore;
    private Double thisWeekScore;
    private Double lastWeekScore;
    private Double improvementPercentage;
    private Integer totalHabits;
    private Integer totalCompletedDays;
    private Integer totalTargetDays;
    private String performanceMessage;
    private List<PerformanceHabitScoreResponse> habitScores;

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }

    public Double getThisWeekScore() { return thisWeekScore; }
    public void setThisWeekScore(Double thisWeekScore) { this.thisWeekScore = thisWeekScore; }

    public Double getLastWeekScore() { return lastWeekScore; }
    public void setLastWeekScore(Double lastWeekScore) { this.lastWeekScore = lastWeekScore; }

    public Double getImprovementPercentage() { return improvementPercentage; }
    public void setImprovementPercentage(Double improvementPercentage) { this.improvementPercentage = improvementPercentage; }

    public Integer getTotalHabits() { return totalHabits; }
    public void setTotalHabits(Integer totalHabits) { this.totalHabits = totalHabits; }

    public Integer getTotalCompletedDays() { return totalCompletedDays; }
    public void setTotalCompletedDays(Integer totalCompletedDays) { this.totalCompletedDays = totalCompletedDays; }

    public Integer getTotalTargetDays() { return totalTargetDays; }
    public void setTotalTargetDays(Integer totalTargetDays) { this.totalTargetDays = totalTargetDays; }

    public String getPerformanceMessage() { return performanceMessage; }
    public void setPerformanceMessage(String performanceMessage) { this.performanceMessage = performanceMessage; }

    public List<PerformanceHabitScoreResponse> getHabitScores() { return habitScores; }
    public void setHabitScores(List<PerformanceHabitScoreResponse> habitScores) { this.habitScores = habitScores; }
}