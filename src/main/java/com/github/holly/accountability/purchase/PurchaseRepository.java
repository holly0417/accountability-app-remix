package com.github.holly.accountability.purchase;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Page<Purchase> findByUserIdOrderByPurchaseTimeDesc(Long userId, Pageable pageable);

    @Query("""
            FROM Purchase p
            WHERE p.status IN (:statuses)
            AND p.user.id IN (:userIds)
            """)
    Page<Purchase> findByUserIdAndStatus(List<Long> userIds, List<PurchaseStatus> statuses, Pageable pageable);
}
