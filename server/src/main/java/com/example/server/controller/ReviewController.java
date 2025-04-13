package com.example.server.controller;

import com.example.server.dto.review.ReviewRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.dto.review.ReviewUpdateRequest;
import com.example.server.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Reviews management API")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Get all reviews", description = "Returns a list of all reviews")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/all")
    public List<ReviewResponse> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @Operation(summary = "Get reviews by place ID", description = "Returns a list of reviews for a specific place")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/place/{placeId}")
    public List<ReviewResponse> getReviewsByPlaceId(
            @Parameter(description = "ID of the place to get reviews for")
            @PathVariable Long placeId
    ) {
        return reviewService.getReviewsByPlaceId(placeId);
    }

    @Operation(summary = "Get reviews by user ID", description = "Returns a list of reviews by a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/user/{userId}")
    public List<ReviewResponse> getReviewsByUserId(
            @Parameter(description = "ID of the user to get reviews for")
            @PathVariable Long userId
    ) {
        return reviewService.getReviewsByUserId(userId);
    }

    @Operation(summary = "Get review by ID", description = "Returns a review by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @GetMapping("/{id}")
    public ReviewResponse getReviewById(
            @Parameter(description = "ID of the review to retrieve")
            @PathVariable Long id
    ) {
        return reviewService.getReviewById(id);
    }

    @Operation(summary = "Create new review", description = "Creates a new review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created review",
                    content = @Content(schema = @Schema(implementation = ReviewResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ReviewResponse createReview(@Valid @RequestBody ReviewRequest request) {
        return reviewService.createReview(request);
    }

    @Operation(summary = "Update review", description = "Updates an existing review. Only the review creator can update it.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated review",
                    content = @Content(schema = @Schema(implementation = ReviewResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access denied - only review creator can update"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ReviewResponse updateReview(
            @Parameter(description = "ID of the review to update")
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateRequest request
    ) {
        return reviewService.updateReview(id, request);
    }

    @Operation(summary = "Delete review", description = "Deletes an existing review. Only the review creator or an admin can delete it.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted review"),
            @ApiResponse(responseCode = "403", description = "Access denied - requires ADMIN role or review ownership"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "ID of the review to delete")
            @PathVariable Long id
    ) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
} 