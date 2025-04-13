package com.example.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "lat", precision = 9, scale = 6, nullable = false)
    private BigDecimal lat;

    @Column(name = "lon", precision = 9, scale = 6, nullable = false)
    private BigDecimal lon;

    @Column(name = "wheelchair_accessible")
    private boolean wheelchairAccessible;

    @Column(name = "tactile_elements")
    private boolean tactileElements;

    @Column(name = "braille_signage")
    private boolean brailleSignage;

    @Column(name = "accessible_toilets")
    private boolean accessibleToilets;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50)
    private PlaceCategory category;

    @Column(name = "overall_accessibility_score", precision = 3, scale = 2)
    private BigDecimal overallAccessibilityScore;

    @Column(name = "created_at", nullable = false)
    private Long createdAt;

    @Column(name = "updated_at")
    private Long updatedAt;

    @Column(name = "approved")
    private boolean approved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @PrePersist
    protected void onCreate() {
        long now = System.currentTimeMillis();
        createdAt = now;
        updatedAt = now;
        updateScore();
    }

    public void updateScore() {
        updatedAt = System.currentTimeMillis();
        
        int totalFeatures = 4;
        int enabledFeatures = 0;

        if (wheelchairAccessible) enabledFeatures++;
        if (tactileElements) enabledFeatures++;
        if (brailleSignage) enabledFeatures++;
        if (accessibleToilets) enabledFeatures++;

        double score = ((double) enabledFeatures / totalFeatures);
        this.overallAccessibilityScore = BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP);
    }
}
