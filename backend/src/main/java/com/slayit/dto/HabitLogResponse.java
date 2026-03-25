package com.slayit.dto;

public class HabitLogResponse {
    private String feedback;

    public HabitLogResponse() {}
    public HabitLogResponse(String feedback) { this.feedback = feedback; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
