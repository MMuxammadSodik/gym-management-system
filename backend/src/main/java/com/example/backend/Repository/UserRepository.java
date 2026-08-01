package com.example.backend.Repository;

import com.example.backend.Entity.User;
import com.example.backend.Entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByRole_Name(RoleName name);

    Optional<User> findByIdAndRole_Name(UUID id, RoleName name);

}