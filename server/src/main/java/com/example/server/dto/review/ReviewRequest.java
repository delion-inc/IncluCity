package com.example.server.dto.review;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.01", message = "Rating must be between 0.01 and 5.00")
    @DecimalMax(value = "5.00", message = "Rating must be between 0.01 and 5.00")
    private BigDecimal rating;
    @NotNull
    private Long placeId;
    @NotBlank
    private String comment;
} 