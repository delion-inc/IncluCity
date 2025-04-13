package com.example.server.service;

import com.example.server.dto.review.ReviewRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.dto.review.ReviewUpdateRequest;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAllReviews();
    List<ReviewResponse> getReviewsByPlaceId(Long placeId);
    List<ReviewResponse> getReviewsByUserId(Long userId);
    ReviewResponse getReviewById(Long id);
    ReviewResponse createReview(ReviewRequest request);
    ReviewResponse updateReview(Long id, ReviewUpdateRequest request);
    void deleteReview(Long id);
} 