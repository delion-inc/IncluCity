package com.example.server.controller;

import com.example.server.dto.place.PlaceRequest;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.place.PlaceUpdateRequest;
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

    @Operation(summary = "Get all places", description = "Returns a list of all places")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved places"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/all")
    public List<PlaceResponse> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @Operation(summary = "Get place by ID", description = "Returns a place by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved place"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @GetMapping("/{id}")
    public PlaceResponse getPlaceById(
            @Parameter(description = "ID of the place to retrieve") 
            @PathVariable Long id
    ) {
        return placeService.getPlaceById(id);
    }

    @Operation(summary = "Create new place", description = "Creates a new place")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created place",
                    content = @Content(schema = @Schema(implementation = PlaceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public PlaceResponse createPlace(@Valid @RequestBody PlaceRequest request) {
        return placeService.createPlace(request);
    }

    @Operation(summary = "Update place", description = "Updates an existing place. All fields are optional - only provided fields will be updated. Requires ADMIN role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated place"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - requires ADMIN role"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PlaceResponse updatePlace(
            @Parameter(description = "ID of the place to update") 
            @PathVariable Long id,
            @Valid @RequestBody PlaceUpdateRequest request
    ) {
        return placeService.updatePlace(id, request);
    }

    @Operation(summary = "Delete place", description = "Deletes an existing place. Requires ADMIN role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted place"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - requires ADMIN role"),
            @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deletePlace(
            @Parameter(description = "ID of the place to delete") 
            @PathVariable Long id
    ) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }
}
