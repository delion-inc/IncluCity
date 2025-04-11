package com.example.server.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AccessDeniedException extends RuntimeException {
    private final HttpStatus status;

    public AccessDeniedException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
} 