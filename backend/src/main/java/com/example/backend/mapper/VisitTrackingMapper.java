package com.example.backend.mapper;

import com.example.backend.Entity.VisitTracking;
import com.example.backend.dto.VisitTrackingRequest;
import com.example.backend.dto.VisitTrackingResponse;
import org.springframework.stereotype.Component;

@Component
public class VisitTrackingMapper {

    public VisitTracking toEntity(VisitTrackingRequest request) {
        return VisitTracking.builder()
                .visitDate(request.getVisitDate())
                .notes(request.getNotes())
                .build();
    }

    public VisitTrackingResponse toResponse(VisitTracking visitTracking) {
        VisitTrackingResponse response = new VisitTrackingResponse();
        response.setId(visitTracking.getId());
        response.setMemberId(visitTracking.getMember().getId());
        response.setMemberFirstName(visitTracking.getMember().getFirstName());
        response.setMemberLastName(visitTracking.getMember().getLastName());
        response.setVisitDate(visitTracking.getVisitDate());
        response.setNotes(visitTracking.getNotes());
        response.setCreatedAt(visitTracking.getCreatedAt());
        return response;
    }
}
