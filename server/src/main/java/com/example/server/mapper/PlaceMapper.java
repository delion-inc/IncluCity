package com.example.server.mapper;

import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import com.example.server.dto.review.PlaceDto;
import com.example.server.entity.Place;
import com.example.server.entity.User;
import com.example.server.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PlaceMapper {

    private final UserMapper userMapper;
    private final ReviewRepository reviewRepository;

    public Place toPlace(PlaceRequest request, User createdBy) {
        return Place.builder()
                .name(request.getName())
                .address(request.getAddress())
                .lat(request.getLat())
                .lon(request.getLon())
                .wheelchairAccessible(request.isWheelchairAccessible())
                .tactileElements(request.isTactileElements())
                .brailleSignage(request.isBrailleSignage())
                .accessibleToilets(request.isAccessibleToilets())
                .category(request.getCategory())
                .createdBy(createdBy)
                .build();
    }

    public PlaceRequest toPlaceRequest(Place place) {
        return PlaceRequest.builder()
                .name(place.getName())
                .address(place.getAddress())
                .lat(place.getLat())
                .lon(place.getLon())
                .wheelchairAccessible(place.isWheelchairAccessible())
                .tactileElements(place.isTactileElements())
                .brailleSignage(place.isBrailleSignage())
                .accessibleToilets(place.isAccessibleToilets())
                .category(place.getCategory())
                .build();
    }

    public void updatePlaceFromRequest(Place place, PlaceRequest request) {
        place.setName(request.getName());
        place.setAddress(request.getAddress());
        place.setLat(request.getLat());
        place.setLon(request.getLon());
        place.setWheelchairAccessible(request.isWheelchairAccessible());
        place.setTactileElements(request.isTactileElements());
        place.setBrailleSignage(request.isBrailleSignage());
        place.setAccessibleToilets(request.isAccessibleToilets());
        place.setCategory(request.getCategory());
    }

    public void updatePlaceFromUpdateRequest(Place place, PlaceUpdateRequest request) {
        if (request.getName() != null) {
            place.setName(request.getName());
        }
        if (request.getAddress() != null) {
            place.setAddress(request.getAddress());
        }
        if (request.getLat() != null) {
            place.setLat(request.getLat());
        }
        if (request.getLon() != null) {
            place.setLon(request.getLon());
        }
        if (request.getWheelchairAccessible() != null) {
            place.setWheelchairAccessible(request.getWheelchairAccessible());
        }
        if (request.getTactileElements() != null) {
            place.setTactileElements(request.getTactileElements());
        }
        if (request.getBrailleSignage() != null) {
            place.setBrailleSignage(request.getBrailleSignage());
        }
        if (request.getAccessibleToilets() != null) {
            place.setAccessibleToilets(request.getAccessibleToilets());
        }
        if (request.getCategory() != null) {
            place.setCategory(request.getCategory());
        }
    }

    public PlaceUpdateRequest toPlaceUpdateResponse(Place place) {
        return PlaceUpdateRequest.builder()
                .name(place.getName())
                .address(place.getAddress())
                .lat(place.getLat())
                .lon(place.getLon())
                .wheelchairAccessible(place.isWheelchairAccessible())
                .tactileElements(place.isTactileElements())
                .brailleSignage(place.isBrailleSignage())
                .accessibleToilets(place.isAccessibleToilets())
                .category(place.getCategory())
                .build();
    }

    public PlaceResponse toPlaceResponse(Place place) {
        if (place == null) {
            return null;
        }

        Double averageRating = reviewRepository.getAverageRatingByPlaceId(place.getId());
        Integer countOfReviews = reviewRepository.countByPlaceId(place.getId());

        return PlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .lat(place.getLat())
                .lon(place.getLon())
                .wheelchairAccessible(place.isWheelchairAccessible())
                .tactileElements(place.isTactileElements())
                .brailleSignage(place.isBrailleSignage())
                .accessibleToilets(place.isAccessibleToilets())
                .category(place.getCategory())
                .overallAccessibilityScore(place.getOverallAccessibilityScore())
                .averageRating(averageRating)
                .countOfReviews(countOfReviews)
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
                .createdBy(userMapper.toUserPlaceDto(place.getCreatedBy()))
                .build();
    }

    public PlaceDto toPlaceDto(Place place) {
        return PlaceDto.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .category(place.getCategory())
                .build();
    }
} 