package com.example.server.controller;

import com.example.server.dto.common.PageResponse;
import com.example.server.dto.place.PlaceResponse;
import com.example.server.dto.user.AuthResponse;
import com.example.server.dto.user.UserRequest;
import com.example.server.service.AuthService;
import com.example.server.service.PlaceService;
import com.example.server.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management API")
public class AdminController {
    private final PlaceService placeService;

    @GetMapping("/places/unapproved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<PlaceResponse>> getUnapprovedPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(placeService.getUnapprovedPlaces(pageable));
    }

    @PostMapping("/places/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlaceResponse> approvePlace(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.approvePlace(id));
    }
} 