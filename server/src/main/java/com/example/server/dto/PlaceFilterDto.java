package com.example.server.dto;

import com.example.server.entity.PlaceCategory;
import lombok.Data;

@Data
public class PlaceFilterDto {
    private PlaceCategory category;
    private Boolean wheelchairAccessible;
    private Boolean tactileElements;
    private Boolean brailleSignage;
    private Boolean accessibleToilets;
} 