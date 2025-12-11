package com.github.holly.accountability.relationships;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "relationship_history")
public class RelationshipHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "relationship_id", nullable = false)
    private Long relationshipId;

    @Column(name = "partnerA_id", nullable = false)
    private Long partnerAId;

    @Column(name = "partnerB_id", nullable = false)
    private Long partnerBId;

    @Column(name="status")
    private RelationshipStatus status;

    @Column(name = "timestamp", columnDefinition = "TIMESTAMP")
    private LocalDateTime timestamp;

    public RelationshipHistory() {

    }

    public RelationshipHistory(Long relationshipId, Long partnerAId, Long partnerBId, RelationshipStatus status, LocalDateTime timestamp) {
        this.relationshipId = relationshipId;
        this.partnerAId = partnerAId;
        this.partnerBId = partnerBId;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getRelationshipId() {
        return relationshipId;
    }

    public void setRelationshipId(Long relationshipId) {
        this.relationshipId = relationshipId;
    }

    public Long getPartnerAId() {
        return partnerAId;
    }

    public void setPartnerAId(Long partnerAId) {
        this.partnerAId = partnerAId;
    }

    public Long getPartnerBId() {
        return partnerBId;
    }

    public void setPartnerBId(Long partnerBId) {
        this.partnerBId = partnerBId;
    }

    public RelationshipStatus getStatus() {
        return status;
    }

    public void setStatus(RelationshipStatus status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
