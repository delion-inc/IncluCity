package com.example.server.util;

import com.example.server.dto.place.PlaceFilterDto;
import com.example.server.entity.Place;
import com.example.server.entity.PlaceCategory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public class SpecificationHelper {
    
    private static final Set<String> VALID_ACCESSIBILITY_FEATURES = Set.of(
            "WHEELCHAIR_ACCESSIBLE",
            "TACTILE_ELEMENTS",
            "BRAILLE_SIGNAGE",
            "ACCESSIBLE_TOILETS"
    );

    public static Specification<Place> buildSpecification(PlaceFilterDto filter) {
        if (filter == null) {
            return isApproved();
        }

        return Specification.where(isApproved())
                .and(hasCategory(filter.getCategory()))
                .and(hasAccessibilityFeatures(filter.getAccessibility()));
    }

    private static Specification<Place> isApproved() {
        return (root, query, cb) -> cb.equal(root.get("approved"), true);
    }

    private static Specification<Place> hasCategory(String categories) {
        if (!StringUtils.hasText(categories)) {
            return Specification.where(null);
        }

        List<PlaceCategory> categoryList = Arrays.stream(categories.split(","))
                .map(String::trim)
                .map(PlaceCategory::valueOf)
                .toList();

        return (root, query, criteriaBuilder) ->
                root.get("category").in(categoryList);
    }

    private static Specification<Place> hasAccessibilityFeatures(String accessibility) {
        if (!StringUtils.hasText(accessibility)) {
            return Specification.where(null);
        }

        List<String> features = Arrays.stream(accessibility.split(","))
                .map(String::trim)
                .toList();

        if (!VALID_ACCESSIBILITY_FEATURES.containsAll(features)) {
            return (root, query, criteriaBuilder) -> criteriaBuilder.disjunction();
        }

        Specification<Place> spec = Specification.where(null);

        for (String feature : features) {
            spec = switch (feature) {
                case "WHEELCHAIR_ACCESSIBLE" -> spec.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.isTrue(root.get("wheelchairAccessible")));
                case "TACTILE_ELEMENTS" -> spec.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.isTrue(root.get("tactileElements")));
                case "BRAILLE_SIGNAGE" -> spec.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.isTrue(root.get("brailleSignage")));
                case "ACCESSIBLE_TOILETS" -> spec.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.isTrue(root.get("accessibleToilets")));
                default -> spec;
            };
        }

        return spec;
    }
} 