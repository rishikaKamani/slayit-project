package com.slayit.dto;

import com.slayit.model.HabitStatus;
import jakarta.validation.constraints.NotNull;

public class HabitLogRequest {
    @NotNull
    private HabitStatus status;

    @NotNull
    private Integer dayNumber;

    public HabitStatus getStatus() {
        return status;
    }

    public void setStatus(HabitStatus status) {
        this.status = status;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
}