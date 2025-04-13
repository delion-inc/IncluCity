package com.example.server.dto.openstreetmap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OpenStreetMapResponse {
    @JsonProperty("display_name")
    private String displayName;
    
    private BigDecimal lat;
    private BigDecimal lon;
} 