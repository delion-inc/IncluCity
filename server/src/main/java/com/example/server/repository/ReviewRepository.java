package com.example.server.repository;

import com.example.server.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByPlaceId(Long placeId);
    List<Review> findAllByUserId(Long userId);
} 