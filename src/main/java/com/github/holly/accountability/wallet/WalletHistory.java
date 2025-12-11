package com.github.holly.accountability.wallet;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_history")
public class WalletHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "wallet_id", nullable = false)
    private Long walletId;

    @Column(name="balance")
    private Double balance;

    @Column(name = "timestamp", columnDefinition = "TIMESTAMP")
    private LocalDateTime timestamp;

    public WalletHistory() {

    }

    public WalletHistory(Long walletId, Long userId, Double balance, LocalDateTime timestamp) {
        this.userId = userId;
        this.walletId = walletId;
        this.balance = balance;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getWalletId() {
        return walletId;
    }

    public void setWalletId(Long walletId) {
        this.walletId = walletId;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
