package com.example.server.service;

import com.example.server.dto.auth.AuthRequest;
import com.example.server.dto.auth.AuthResponse;
import com.example.server.dto.auth.UserRegistrationRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request, HttpServletResponse response);
    
    AuthResponse register(UserRegistrationRequest request, HttpServletResponse response);
    
    AuthResponse refreshToken(String refreshToken, HttpServletResponse response);
    
    void logout(String refreshToken, HttpServletResponse response);
} 