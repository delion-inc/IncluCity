package com.example.server.dto.place;

import com.example.server.dto.user.UserDto;
import com.example.server.dto.user.UserPlaceDto;
import com.example.server.entity.PlaceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceResponse {
    private Long id;
    private String name;
    private String address;
    private BigDecimal lat;
    private BigDecimal lon;
    private boolean wheelchairAccessible;
    private boolean tactileElements;
    private boolean brailleSignage;
    private boolean accessibleToilets;
    private PlaceCategory category;
    private BigDecimal overallAccessibilityScore;
    private Double averageRating;
    private Integer countOfReviews;
    private Long createdAt;
    private Long updatedAt;
    private UserPlaceDto createdBy;
} 