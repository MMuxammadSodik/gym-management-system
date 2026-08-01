package com.example.backend.controller;

import com.example.backend.dto.MemberVisitStatsResponse;
import com.example.backend.dto.VisitTrackingRequest;
import com.example.backend.dto.VisitTrackingResponse;
import com.example.backend.service.VisitTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visit-tracking")
public class VisitTrackingController {

    @Autowired
    private VisitTrackingService visitTrackingService;

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<VisitTrackingResponse>> getVisitsByMemberId(@PathVariable UUID memberId) {
        List<VisitTrackingResponse> visits = visitTrackingService.getVisitsByMemberId(memberId);
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/member/{memberId}/stats")
    public ResponseEntity<MemberVisitStatsResponse> getMemberVisitStats(@PathVariable UUID memberId) {
        try {
            MemberVisitStatsResponse stats = visitTrackingService.getMemberVisitStats(memberId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/member/{memberId}")
    public ResponseEntity<?> addVisit(@PathVariable UUID memberId, @RequestBody VisitTrackingRequest request) {
        try {
            VisitTrackingResponse response = visitTrackingService.addVisit(memberId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{visitId}")
    public ResponseEntity<Void> deleteVisit(@PathVariable UUID visitId) {
        visitTrackingService.deleteVisit(visitId);
        return ResponseEntity.noContent().build();
    }
}
