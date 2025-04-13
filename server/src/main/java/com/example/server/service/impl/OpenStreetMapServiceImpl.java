package com.example.server.service.impl;

import com.example.server.dto.openstreetmap.OpenStreetMapResponse;
import com.example.server.dto.openstreetmap.OpenStreetMapSearchResponse;
import com.example.server.entity.Place;
import com.example.server.repository.PlaceRepository;
import com.example.server.service.OpenStreetMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenStreetMapServiceImpl implements OpenStreetMapService {
    private static final int MAX_RESULTS = 5;
    private static final String CITY_NAME = "Львів";
    private static final String COUNTRY_NAME = "Україна";
    private final PlaceRepository placeRepository;
    private final RestTemplate restTemplate;

    @Value("${openstreetmap.api.url}")
    private String openStreetMapApiUrl;

    public List<OpenStreetMapSearchResponse> searchPlaces(String query) {
        List<OpenStreetMapSearchResponse> results = new ArrayList<>();

        List<Place> localPlaces = placeRepository.findByNameContainingIgnoreCase(query);
        if (!localPlaces.isEmpty()) {
            results.addAll(localPlaces.stream()
                    .map(place -> OpenStreetMapSearchResponse.builder()
                            .name(place.getName())
                            .lat(place.getLat())
                            .lon(place.getLon())
                            .build())
                    .limit(MAX_RESULTS)
                    .toList());
        }

        if (results.size() >= MAX_RESULTS) {
            return results;
        }

        String citySearchQuery = query + ", " + CITY_NAME + ", " + COUNTRY_NAME;
        String cityUrl = buildSearchUrl(citySearchQuery);
        OpenStreetMapResponse[] cityResponse = restTemplate.getForObject(cityUrl, OpenStreetMapResponse[].class);
        
        if (cityResponse != null && cityResponse.length > 0) {
            results.addAll(Arrays.stream(cityResponse)
                    .map(this::convertToSearchResponse)
                    .limit(MAX_RESULTS - results.size())
                    .toList());
        }
        return results;
    }

    private String buildSearchUrl(String query) {
        return UriComponentsBuilder.fromHttpUrl(openStreetMapApiUrl)
                .queryParam("q", query)
                .queryParam("format", "json")
                .queryParam("limit", 10)
                .queryParam("accept-language", "uk")
                .queryParam("feature-type", "amenity")
                .build()
                .toUriString();
    }

    private OpenStreetMapSearchResponse convertToSearchResponse(OpenStreetMapResponse osmResponse) {
        return OpenStreetMapSearchResponse.builder()
                .name(osmResponse.getDisplayName())
                .lat(osmResponse.getLat())
                .lon(osmResponse.getLon())
                .build();
    }
} 