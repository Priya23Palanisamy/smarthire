package com.smarthire.recruiter.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostDto {
    @NotBlank(message = "Job title is required")
    private String title;

    private String salary;

    @NotBlank(message = "Required skills are required")
    private String skills;

    private String experience;
    private String location;

    @NotBlank(message = "Job type is required (e.g., Full-time, Remote)")
    private String jobType;

    @NotBlank(message = "Job description is required")
    private String description;

    private String responsibilities;
    private String qualification;

    @FutureOrPresent(message = "Application deadline must be today or in the future")
    private LocalDate applicationDeadline;

    @Builder.Default
    private boolean active = true;
}
