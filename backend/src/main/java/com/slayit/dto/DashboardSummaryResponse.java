package com.slayit.dto;

public class DashboardSummaryResponse {
    private Integer totalHabits;
    private Integer completedToday;
    private Integer activeStreaks;
    private String message;
    private String rewardMessage;

    public Integer getTotalHabits() { return totalHabits; }
    public void setTotalHabits(Integer totalHabits) { this.totalHabits = totalHabits; }

    public Integer getCompletedToday() { return completedToday; }
    public void setCompletedToday(Integer completedToday) { this.completedToday = completedToday; }

    public Integer getActiveStreaks() { return activeStreaks; }
    public void setActiveStreaks(Integer activeStreaks) { this.activeStreaks = activeStreaks; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRewardMessage() { return rewardMessage; }
    public void setRewardMessage(String rewardMessage) { this.rewardMessage = rewardMessage; }
}