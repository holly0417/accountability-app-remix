package com.github.holly.accountability.user;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAmount;
import java.util.Date;

@Entity
@Table(name = "password_reset_token")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private static final int EXPIRATION = 60 * 24 * 60;

    @Column(name = "token")
    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name="user_id")
    private User user;

    @Column(name = "expiry_date", columnDefinition = "DATETIME")
    private LocalDateTime expiryDate;

    public PasswordResetToken() {

    }

    public PasswordResetToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = LocalDateTime.now().plusDays(1);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

}
