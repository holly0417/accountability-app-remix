package com.github.holly.accountability.relationships;

import com.github.holly.accountability.user.User;
import jakarta.persistence.*;

@EntityListeners(RelationshipEntityListener.class)
@Entity
@Table(name = "relationships")
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "status")
    private RelationshipStatus status;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    public Relationship() {

    }

    public Relationship(User requester, User recipient, RelationshipStatus status) {
        this.requester = requester;
        this.recipient = recipient;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RelationshipStatus getStatus() {
        return status;
    }

    public void setStatus(RelationshipStatus status) {
        this.status = status;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public Relationship flipped() {
        Relationship flipped = new Relationship(this.getRecipient(), this.getRequester(), this.getStatus());
        flipped.setId(this.getId());
        return flipped;
    }

}
