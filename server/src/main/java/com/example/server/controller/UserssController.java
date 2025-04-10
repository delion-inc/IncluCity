package com.example.server.controller;

import com.example.server.dto.auth.AuthRequest;
import com.example.server.dto.auth.AuthResponse;
import com.example.server.dto.auth.UserRegistrationRequest;
import com.example.server.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserssController {

    private final AuthService authService;

    @GetMapping("/current")
    public String dslogin() {
        return "sdsd";
    }
} 