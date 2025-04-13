package com.example.server.service;

import com.example.server.dto.common.PageResponse;
import com.example.server.dto.place.PlaceFilterDto;
import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PlaceService {
    List<PlaceResponse> getAllPlaces(PlaceFilterDto filter);

    PlaceResponse getPlaceById(Long id);

    PlaceResponse createPlace(PlaceRequest request);

    PlaceResponse updatePlace(Long id, PlaceUpdateRequest request);

    void deletePlace(Long id);

    // Admin methods
    PageResponse<PlaceResponse> getUnapprovedPlaces(Pageable pageable);
    PlaceResponse approvePlace(Long id);
} 