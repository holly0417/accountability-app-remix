package com.github.holly.accountability.wallet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Wallet findByUserId(Long userId);

    @Query("""
        FROM Wallet w
        WHERE w.user.id in (:userIds)
        """)
    Page<Wallet> findByUserList(List<Long> userIds, Pageable pageable);
}

