package com.example.backend.controller;

import com.example.backend.service.SinglePurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/single-purchase")
@RequiredArgsConstructor
public class SinglePurchaseController {

    private final SinglePurchaseService singlePurchaseService;

    @GetMapping("/price")
    public ResponseEntity<BigDecimal> getDefaultPrice() {
        return ResponseEntity.ok(singlePurchaseService.getDefaultPrice());
    }

    @PostMapping("/price")
    public ResponseEntity<BigDecimal> setDefaultPrice(@RequestBody BigDecimal price) {
        singlePurchaseService.setDefaultPrice(price);
        return ResponseEntity.ok(price);
    }
}
