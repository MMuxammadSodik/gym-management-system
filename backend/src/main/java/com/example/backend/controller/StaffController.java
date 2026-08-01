package com.example.backend.controller;

import com.example.backend.dto.StaffRequest;
import com.example.backend.dto.StaffResponse;
import com.example.backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public List<StaffResponse> getAll() {
        return staffService.getAll();
    }

    @GetMapping("/{id}")
    public StaffResponse getById(@PathVariable UUID id) {
        return staffService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StaffResponse create(@RequestBody StaffRequest request) {
        return staffService.create(request);
    }

    @PutMapping("/{id}")
    public StaffResponse update(
            @PathVariable UUID id,
            @RequestBody StaffRequest request
    ) {
        return staffService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        staffService.delete(id, authentication);
    }

}
