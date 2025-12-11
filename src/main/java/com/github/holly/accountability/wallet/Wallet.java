package com.github.holly.accountability.wallet;


import com.github.holly.accountability.user.User;
import jakarta.persistence.*;

@EntityListeners(WalletEntityListener.class)
@Entity
@Table(name="wallet")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(name="balance")
    private double balance = 0.00D;

    public Wallet(){
    }

    public Wallet(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
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

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void addBalance(double balance) {
        this.balance += balance;
    }

    public void subtractBalance(double balance) {
        if(this.balance - balance < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }

        this.balance -= balance;
    }
}
