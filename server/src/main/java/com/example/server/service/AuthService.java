package com.example.server.service;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.AuthResponse;
import com.example.server.dto.UserRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request, HttpServletResponse response);
    
    AuthResponse register(UserRequest request, HttpServletResponse response);
    
    AuthResponse refreshToken(String refreshToken, HttpServletResponse response);
    
    void logout(String refreshToken, HttpServletResponse response);
} 