package com.example.server.service.impl;

import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import com.example.server.entity.Place;
import com.example.server.exception.PlaceNotFound;
import com.example.server.mapper.PlaceMapper;
import com.example.server.repository.PlaceRepository;
import com.example.server.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;
    private final PlaceMapper placeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PlaceResponse> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(placeMapper::toPlaceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlaceResponse getPlaceById(Long id) {
        return placeRepository.findById(id)
                .map(placeMapper::toPlaceResponse)
                .orElseThrow(() -> new PlaceNotFound("Place not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional
    public PlaceResponse createPlace(PlaceRequest request) {
        Place place = placeMapper.toPlace(request);
        Place savedPlace = placeRepository.save(place);
        return placeMapper.toPlaceResponse(savedPlace);
    }

    @Override
    @Transactional
    public PlaceResponse updatePlace(Long id, PlaceUpdateRequest request) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new PlaceNotFound("Place not found with id: " + id, HttpStatus.NOT_FOUND));

        placeMapper.updatePlaceFromUpdateRequest(place, request);
        Place updatedPlace = placeRepository.save(place);
        return placeMapper.toPlaceResponse(updatedPlace);
    }

    @Override
    @Transactional
    public void deletePlace(Long id) {
        if (!placeRepository.existsById(id)) {
            throw new PlaceNotFound("Place not found with id: " + id, HttpStatus.NOT_FOUND);
        }
        placeRepository.deleteById(id);
    }
} 