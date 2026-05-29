package com.smarthire.recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponseDto {
    private Long id;
    private String title;
    private String salary;
    private String skills;
    private String experience;
    private String location;
    private String jobType;
    private String description;
    private String responsibilities;
    private String qualification;
    private LocalDate applicationDeadline;
    private boolean active;
    private LocalDateTime createdAt;

    // Recruiter info
    private Long recruiterId;
    private String companyName;
    private String companyLogo;
    private String website;
}
