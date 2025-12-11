package com.github.holly.accountability.wallet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WalletHistoryRepository extends JpaRepository<WalletHistory, Long> {

    @Query(value = """
        SELECT
            w.id,
            w.wallet_id,
            w.user_id,
            w.balance,
            w.timestamp
        FROM
            wallet_history AS w
        WHERE
            w.user_id IN (:userIds)
        ORDER BY w.timestamp DESC;
        """, nativeQuery = true)
    Page<WalletHistory> findByUserId(List<Long> userIds, Pageable pageable);


    @Query(value = """
        SELECT id, wallet_id, user_id, balance,
                      date as timestamp FROM
            (SELECT *,
               ROW_NUMBER() OVER(PARTITION BY date ORDER BY timestamp DESC) AS rownum
            FROM
                (SELECT *,
                    date(w.timestamp) AS date
                FROM
                    wallet_history AS w
                WHERE
                    w.user_id IN (:userIds)) AS a)
            AS b
        WHERE rownum=1;
        """, nativeQuery = true)
    Page<WalletHistory> getDailyTimelineByUserId(Long userIds, Pageable pageable);
}

