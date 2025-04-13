package com.example.server.service;

import com.example.server.dto.openstreetmap.OpenStreetMapSearchResponse;

import java.util.List;

public interface OpenStreetMapService {

    List<OpenStreetMapSearchResponse> searchPlaces(String query);
}
