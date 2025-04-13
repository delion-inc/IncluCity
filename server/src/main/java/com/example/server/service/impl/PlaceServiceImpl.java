package com.example.server.service.impl;

import com.example.server.dto.common.PageResponse;
import com.example.server.dto.place.PlaceFilterDto;
import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import com.example.server.entity.Place;
import com.example.server.entity.User;
import com.example.server.exception.PlaceNotFound;
import com.example.server.mapper.PlaceMapper;
import com.example.server.repository.PlaceRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.PlaceService;
import com.example.server.util.SpecificationHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;
    private final PlaceMapper placeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PlaceResponse> getAllPlaces(PlaceFilterDto filter) {
        Specification<Place> spec = SpecificationHelper.buildSpecification(filter);
        return placeRepository.findAll(spec).stream()
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
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Current user not found"));

        Place place = placeMapper.toPlace(request, currentUser);
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
        updatedPlace.updateScore();
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

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PlaceResponse> getUnapprovedPlaces(Pageable pageable) {
        var page = placeRepository.findByApprovedFalse(pageable);
        return new PageResponse<>(
                page.getContent().stream()
                        .map(placeMapper::toPlaceResponse)
                        .toList(),
                (int) page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber()
        );
    }

    @Override
    @Transactional
    public PlaceResponse approvePlace(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new PlaceNotFound("Place not found with id: " + id, HttpStatus.NOT_FOUND));
        
        place.setApproved(true);
        Place approvedPlace = placeRepository.save(place);
        return placeMapper.toPlaceResponse(approvedPlace);
    }
} 