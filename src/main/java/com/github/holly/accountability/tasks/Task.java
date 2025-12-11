package com.github.holly.accountability.tasks;

import com.github.holly.accountability.user.User;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;

@EntityListeners(TaskEntityListener.class)
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    @Column(name = "time_start", columnDefinition = "TIMESTAMP")
    private LocalDateTime timeStart;

    @Column(name = "time_end", columnDefinition = "TIMESTAMP")
    private LocalDateTime timeEnd;

    //duration will be saved in seconds
    @Column(name = "duration", columnDefinition = "BIGINT")
    private Duration duration = Duration.ZERO;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // for Hibernate
    public Task() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public void setTimeStart(LocalDateTime timeStart) {
        this.timeStart = timeStart;
    }

    public void setTimeEnd(LocalDateTime timeEnd) {
        this.timeEnd = timeEnd;
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

    public LocalDateTime getTimeStart() {
        return this.timeStart;
    }

    public LocalDateTime getTimeEnd() {
        return this.timeEnd;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public Duration getDuration() { return this.duration; }
}
