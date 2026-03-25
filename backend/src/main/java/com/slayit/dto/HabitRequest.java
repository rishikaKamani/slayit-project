package com.slayit.dto;

import com.slayit.model.HabitCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HabitRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private HabitCategory category;

    @NotNull
    @Min(1)
    @Max(365)
    private Integer durationDays;

    private Boolean timeBound = false;

    private String targetTime;

    @Min(0)
    @Max(180)
    private Integer graceMinutes = 0;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public HabitCategory getCategory() {
        return category;
    }

    public void setCategory(HabitCategory category) {
        this.category = category;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Boolean getTimeBound() {
        return timeBound;
    }

    public void setTimeBound(Boolean timeBound) {
        this.timeBound = timeBound;
    }

    public String getTargetTime() {
        return targetTime;
    }

    public void setTargetTime(String targetTime) {
        this.targetTime = targetTime;
    }

    public Integer getGraceMinutes() {
        return graceMinutes;
    }

    public void setGraceMinutes(Integer graceMinutes) {
        this.graceMinutes = graceMinutes;
    }
}