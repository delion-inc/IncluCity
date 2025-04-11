package com.example.server.dto.review;

import com.example.server.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private PlaceDto place;
    private UserDto user;
    private Double rating;
    private String comment;
    private Long createdAt;
    private Long updatedAt;
} 