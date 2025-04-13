package com.example.server.controller;

import com.example.server.dto.openstreetmap.OpenStreetMapSearchResponse;
import com.example.server.dto.place.PlaceFilterDto;
import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
import com.example.server.service.OpenStreetMapService;
import com.example.server.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
@Tag(name = "Places", description = "Places management API")
public class PlaceController {
    private final PlaceService placeService;
    private final OpenStreetMapService openStreetMapService;

    @Operation(summary = "Get all places", description = "Returns a list of all places with optional filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved places"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/all")
    public ResponseEntity<List<PlaceResponse>> getAllPlaces(
            @Parameter(description = "Filter parameters")
            @ModelAttribute PlaceFilterDto filter
    ) {
        return ResponseEntity.ok(placeService.getAllPlaces(filter));
    }

    @Operation(summary = "Get place by ID", description = "Returns a place by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved place"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PlaceResponse> getPlaceById(
            @Parameter(description = "ID of the place to retrieve")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(placeService.getPlaceById(id));
    }

    @Operation(summary = "Create new place", description = "Creates a new place")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created place",
                    content = @Content(schema = @Schema(implementation = PlaceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<PlaceResponse> createPlace(@Valid @RequestBody PlaceRequest request) {
        return ResponseEntity.ok(placeService.createPlace(request));
    }

    @Operation(summary = "Update place", description = "Updates an existing place")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated place"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<PlaceResponse> updatePlace(
            @Parameter(description = "ID of the place to update")
            @PathVariable Long id,
            @Valid @RequestBody PlaceUpdateRequest request
    ) {
        return ResponseEntity.ok(placeService.updatePlace(id, request));
    }

    @Operation(summary = "Delete place", description = "Deletes an existing place")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted place"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deletePlace(
            @Parameter(description = "ID of the place to delete")
            @PathVariable Long id
    ) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Search places", description = "Searches for places by name in local database and OpenStreetMap")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully found places"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @GetMapping("/search")
    public ResponseEntity<List<OpenStreetMapSearchResponse>> searchPlaces(@RequestParam String query) {
        return ResponseEntity.ok(openStreetMapService.searchPlaces(query));
    }
}
