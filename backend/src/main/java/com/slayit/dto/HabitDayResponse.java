package com.slayit.dto;

public class HabitDayResponse {
    private Integer day;
    private String status;

    public HabitDayResponse() {
    }

    public HabitDayResponse(Integer day, String status) {
        this.day = day;
        this.status = status;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}