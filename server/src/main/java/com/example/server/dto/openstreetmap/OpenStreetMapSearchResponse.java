package com.example.server.dto.openstreetmap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenStreetMapSearchResponse {
    private String name;
    private BigDecimal lat;
    private BigDecimal lon;
    private Long placeId;
} 