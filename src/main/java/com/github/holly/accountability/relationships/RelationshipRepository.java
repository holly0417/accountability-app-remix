package com.github.holly.accountability.relationships;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    @Query("""
        FROM Relationship r
        WHERE (r.requester.id = :userId AND r.recipient.id =:otherUserId)
        OR (r.requester.id = :otherUserId AND r.recipient.id =:userId)
        """)
    Optional<Relationship> findRelationship(Long userId, Long otherUserId);


    @Query("""
        FROM Relationship r
        WHERE (r.requester.id = :userId)
        AND r.status in (:statuses)
        """)
    Page<Relationship> getRelationshipsByStatusAndUserAsRequester(Long userId,
                                                         List<RelationshipStatus> statuses,
                                                         Pageable pageable);

    @Query("""
        FROM Relationship r
        WHERE (r.recipient.id = :userId)
        AND r.status in (:statuses)
        """)
    Page<Relationship> getRelationshipsByStatusAndUserAsRecipient(Long userId,
                                                            List<RelationshipStatus> statuses,
                                                            Pageable pageable);

    @Query("""
        FROM Relationship r
        WHERE (r.requester.id = :userId OR r.recipient.id =:userId)
        AND r.status in (:statuses)
        """)
    Page<Relationship> getRelationshipsByUserIdAndStatusIgnoreDirection(Long userId,
                                                                        List<RelationshipStatus> statuses,
                                                                        Pageable pageable);

    @Query("""
        FROM Relationship r
        WHERE (r.requester.id = :currentUserId AND r.recipient.id =:otherUserId)
        OR (r.requester.id = :otherUserId AND r.recipient.id =:currentUserId)
        AND r.status in (:statuses)
        """)
    List<Relationship> checkRelationshipExistsByStatusIgnoreDirection(Long currentUserId,
                                                                      Long otherUserId,
                                                                      List<RelationshipStatus> statuses);
}
