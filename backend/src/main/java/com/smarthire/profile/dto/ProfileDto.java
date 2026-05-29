package com.smarthire.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String address;
    private String bio;
    private String email;
    private String phoneNumber;
    private String linkedinUrl;
    private String githubUrl;
    private String profileImageUrl;
    private int completionPercentage;

    private ResumeDto resume;
    private List<SkillDto> skills;
    private List<EducationDto> educationList;
    private List<ExperienceDto> experienceList;
    private List<CertificateDto> certificates;
}
