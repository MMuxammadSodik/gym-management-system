package com.example.backend.controller;

import com.example.backend.dto.MemberRequest;
import com.example.backend.dto.MemberResponse;
import com.example.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public List<MemberResponse> getAll() {
        return memberService.getAll();
    }

    @GetMapping("/{id}")
    public MemberResponse getById(@PathVariable UUID id) {
        return memberService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse create(@RequestBody MemberRequest request) {
        return memberService.create(request);
    }

    @PutMapping("/{id}")
    public MemberResponse update(
            @PathVariable UUID id,
            @RequestBody MemberRequest request
    ) {
        return memberService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        memberService.delete(id);
    }

    @GetMapping("/created-today")
    public List<MemberResponse> getMembersCreatedToday() {
        return memberService.getMembersCreatedToday();
    }

}
