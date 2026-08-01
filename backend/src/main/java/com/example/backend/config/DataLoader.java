package com.example.backend.config;

import com.example.backend.Entity.Role;
import com.example.backend.Entity.RoleName;
import com.example.backend.Entity.User;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseGet(() -> {
                    Role role = Role.builder()
                            .name(RoleName.ADMIN)
                            .build();
                    return roleRepository.save(role);
                });

        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = User.builder()
                    .username("admin")
                    .firstName("IRON ARM")
                    .lastName("Administrator")
                    .password(passwordEncoder.encode("ironarm26"))
                    .role(adminRole)
                    .build();

            userRepository.save(admin);

            System.out.println("=================================");
            System.out.println(" Default admin created");
            System.out.println(" Username: admin");
            System.out.println(" Password: ironarm26");
            System.out.println("=================================");
        }
    }
}