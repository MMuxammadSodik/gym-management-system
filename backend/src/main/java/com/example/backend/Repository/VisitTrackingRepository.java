package com.example.backend.Repository;

import com.example.backend.Entity.Member;
import com.example.backend.Entity.VisitTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VisitTrackingRepository extends JpaRepository<VisitTracking, UUID> {

    List<VisitTracking> findByMemberIdOrderByVisitDateDesc(UUID memberId);

    List<VisitTracking> findByMemberIdAndVisitDate(UUID memberId, LocalDate visitDate);

    @Query("SELECT COUNT(v) FROM VisitTracking v WHERE v.member.id = :memberId AND v.visitDate >= :startDate AND v.visitDate <= :endDate")
    long countVisitsInMonth(@Param("memberId") UUID memberId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(v) FROM VisitTracking v WHERE v.member.id = :memberId AND v.visitDate = :visitDate")
    long countVisitsOnDate(@Param("memberId") UUID memberId, @Param("visitDate") LocalDate visitDate);

    boolean existsByMemberIdAndVisitDate(UUID memberId, LocalDate visitDate);
}
