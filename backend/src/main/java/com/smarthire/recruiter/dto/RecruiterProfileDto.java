package com.smarthire.recruiter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfileDto {
    private Long id;
    private String username;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyLogo;
    private String website;

    @NotBlank(message = "Company description is required")
    private String companyDescription;

    private String companyLocation;

    @Email(message = "Invalid email format")
    private String contactEmail;
}
