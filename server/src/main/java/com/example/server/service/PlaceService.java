package com.example.server.service;

import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;

import java.util.List;

public interface PlaceService {
    List<PlaceResponse> getAllPlaces();
    PlaceResponse getPlaceById(Long id);
    PlaceResponse createPlace(PlaceRequest request);
    PlaceResponse updatePlace(Long id, PlaceUpdateRequest request);
    void deletePlace(Long id);
} 