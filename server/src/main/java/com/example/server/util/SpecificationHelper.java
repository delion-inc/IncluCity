package com.example.server.util;

import com.example.server.dto.PlaceFilterDto;
import com.example.server.entity.Place;
import com.example.server.entity.PlaceCategory;
import org.springframework.data.jpa.domain.Specification;

public class SpecificationHelper {
    
    public static Specification<Place> buildSpecification(PlaceFilterDto filter) {
        if (filter == null) {
            return Specification.where(null);
        }

        return Specification.where(hasCategory(filter.getCategory()))
                .and(isWheelchairAccessible(filter.getWheelchairAccessible()))
                .and(hasTactileElements(filter.getTactileElements()))
                .and(hasBrailleSignage(filter.getBrailleSignage()))
                .and(hasAccessibleToilets(filter.getAccessibleToilets()));
    }
    
    public static Specification<Place> hasCategory(PlaceCategory category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("category"), category);
        };
    }

    public static Specification<Place> isWheelchairAccessible(Boolean wheelchairAccessible) {
        return (root, query, criteriaBuilder) -> {
            if (wheelchairAccessible == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("wheelchairAccessible"), wheelchairAccessible);
        };
    }

    public static Specification<Place> hasTactileElements(Boolean tactileElements) {
        return (root, query, criteriaBuilder) -> {
            if (tactileElements == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("tactileElements"), tactileElements);
        };
    }

    public static Specification<Place> hasBrailleSignage(Boolean brailleSignage) {
        return (root, query, criteriaBuilder) -> {
            if (brailleSignage == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("brailleSignage"), brailleSignage);
        };
    }

    public static Specification<Place> hasAccessibleToilets(Boolean accessibleToilets) {
        return (root, query, criteriaBuilder) -> {
            if (accessibleToilets == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("accessibleToilets"), accessibleToilets);
        };
    }
} 