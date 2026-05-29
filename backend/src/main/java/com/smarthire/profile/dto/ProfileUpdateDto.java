package com.smarthire.profile.dto;

import jakarta.validation.constraints.Email;
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
public class ProfileUpdateDto {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String gender;
    private LocalDate dob;
    private String address;
    private String bio;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;
    private String linkedinUrl;
    private String githubUrl;
}
