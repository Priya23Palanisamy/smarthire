package com.smarthire.profile.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String role;

    private Integer yearsOfExperience;

    @Column(columnDefinition = "TEXT")
    private String description;
}
