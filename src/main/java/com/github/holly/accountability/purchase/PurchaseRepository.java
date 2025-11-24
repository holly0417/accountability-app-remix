package com.github.holly.accountability.purchase;

import com.github.holly.accountability.tasks.Task;
import com.github.holly.accountability.tasks.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Page<Purchase> findByUserIdOrderByPurchaseTimeDesc(Long userId, Pageable pageable);

    @Query("""
        FROM Purchase p
        WHERE p.status = :status
        AND p.user.id = :userId
        """)
    Page<Purchase> findByUserIdAndStatus(Long userId, PurchaseStatus status, Pageable pageable);
}
