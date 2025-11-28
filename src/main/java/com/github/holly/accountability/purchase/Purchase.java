package com.github.holly.accountability.purchase;
import com.github.holly.accountability.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="purchasing_history")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(name="price")
    private Double price = 0.00D;

    @Column(name="description")
    private String description;

    @Column(name="purchase_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime purchaseTime = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private PurchaseStatus status = PurchaseStatus.LISTED;

    public Purchase(){

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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getPurchaseTime() {
        return purchaseTime;
    }

    public void setPurchaseTime(LocalDateTime purchaseTime) {
        this.purchaseTime = purchaseTime;
    }

    public PurchaseStatus getStatus() {
        return status;
    }
    public void setStatus(PurchaseStatus status) {
        this.status = status;
    }
}
