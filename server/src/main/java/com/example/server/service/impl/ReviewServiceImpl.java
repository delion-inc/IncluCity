package com.example.server.service.impl;

import com.example.server.dto.review.ReviewRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.dto.review.ReviewUpdateRequest;
import com.example.server.entity.Place;
import com.example.server.entity.Review;
import com.example.server.entity.User;
import com.example.server.exception.AccessDeniedException;
import com.example.server.exception.PlaceNotFound;
import com.example.server.exception.ReviewNotFound;
import com.example.server.mapper.ReviewMapper;
import com.example.server.repository.PlaceRepository;
import com.example.server.repository.ReviewRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByPlaceId(Long placeId) {
        return reviewRepository.findAllByPlaceId(placeId).stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUserId(Long userId) {
        return reviewRepository.findAllByUserId(userId).stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long id) {
        return reviewRepository.findById(id)
                .map(reviewMapper::toReviewResponse)
                .orElseThrow(() -> new ReviewNotFound("Review not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Current user not found"));

        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new PlaceNotFound("Place not found with id: " + request.getPlaceId(), HttpStatus.NOT_FOUND));

        Review review = reviewMapper.toReview(request, place, currentUser);
        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toReviewResponse(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long id, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFound("Review not found with id: " + id, HttpStatus.NOT_FOUND));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Current user not found"));

        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only update your own reviews", HttpStatus.FORBIDDEN);
        }

        review.setComment(request.getComment());
        review.setUpdatedAt(System.currentTimeMillis());

        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewResponse(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFound("Review not found with id: " + id, HttpStatus.NOT_FOUND));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Current user not found"));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        if (!isAdmin && !review.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own reviews or must be an admin", HttpStatus.FORBIDDEN);
        }

        reviewRepository.deleteById(id);
    }
} 