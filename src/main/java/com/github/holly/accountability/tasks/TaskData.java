package com.github.holly.accountability.tasks;

import java.time.Duration;

public class TaskData {
    private Long id;

    private Long userId;

    private String userName;

    private String description;

    private TaskStatus status = TaskStatus.PENDING;

    private Duration duration = Duration.ZERO;

    private String durationString;

    private Long durationNumber;

    public TaskData() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public void setDurationString(String durationString) {
        this.durationString = durationString;
    }

    public Long getDurationNumber() {
        return this.durationNumber;
    }
    public void setDurationNumber() {
        this.durationNumber = this.duration.toSeconds();
    }

    public Long getId() {
        return this.id;
    }

    public String getDescription() {
        return this.description;
    }

    public TaskStatus getStatus() {
        return this.status;
    }

    public Duration getDuration() { return this.duration; }

    public String getDurationString() { return this.durationString; }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
