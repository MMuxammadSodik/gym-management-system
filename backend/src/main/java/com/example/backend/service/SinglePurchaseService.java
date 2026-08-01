package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SinglePurchaseService {

    @Value("${single.purchase.default.price:50000}")
    private BigDecimal defaultPrice;

    public BigDecimal getDefaultPrice() {
        return defaultPrice;
    }

    public void setDefaultPrice(BigDecimal price) {
        this.defaultPrice = price;
    }
}
