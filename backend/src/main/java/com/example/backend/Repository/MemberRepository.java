package com.example.backend.Repository;

import com.example.backend.Entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {

    List<Member> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}
