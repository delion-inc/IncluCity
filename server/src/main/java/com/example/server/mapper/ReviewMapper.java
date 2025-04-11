package com.example.server.mapper;

import com.example.server.dto.review.ReviewRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.entity.Place;
import com.example.server.entity.Review;
import com.example.server.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewMapper {

    private final UserMapper userMapper;
    private final PlaceMapper placeMapper;

    public Review toReview(ReviewRequest request, Place place, User user) {
        return Review.builder()
                .place(place)
                .user(user)
                .rating(request.getRating().doubleValue())
                .comment(request.getComment())
                .build();
    }

    public ReviewResponse toReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .place(placeMapper.toPlaceDto(review.getPlace()))
                .user(userMapper.toUserDto(review.getUser()))
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
} 