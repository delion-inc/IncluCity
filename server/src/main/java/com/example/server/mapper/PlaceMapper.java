package com.example.server.mapper;

import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import com.example.server.entity.Place;
import org.springframework.stereotype.Component;

@Component
public class PlaceMapper {

    public Place toPlace(PlaceRequest request) {
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
                .build();
    }

    public PlaceResponse toPlaceResponse(Place place) {
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
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
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
} 