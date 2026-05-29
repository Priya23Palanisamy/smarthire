package com.smarthire.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDto {
    private Long id;

    @NotBlank(message = "Degree/Standard is required")
    private String degree;

    @NotBlank(message = "College/School is required")
    private String college;

    @NotNull(message = "Start year is required")
    private Integer startYear;

    private Integer endYear;

    private Double cgpa;
}
