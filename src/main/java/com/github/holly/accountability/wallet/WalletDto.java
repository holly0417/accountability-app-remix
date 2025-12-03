package com.github.holly.accountability.wallet;

public class WalletDto {
    private Long id;

    private Long userId;

    private String userName;

    private Double balance = 0.00D;

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

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

    public Long getId() {
        return id;
    }
    public void setId(Long id) {}
}
