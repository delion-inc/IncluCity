package com.example.server.repository;

import com.example.server.entity.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>, JpaSpecificationExecutor<Place> {
    Page<Place> findByApprovedFalse(Pageable pageable);
    List<Place> findByNameContainingIgnoreCase(String name);
    List<Place> findByNameContainingIgnoreCaseAndApprovedTrue(String name);
} 