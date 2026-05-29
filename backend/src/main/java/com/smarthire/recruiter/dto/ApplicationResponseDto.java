package com.smarthire.recruiter.dto;

import com.smarthire.profile.dto.ProfileDto;
import com.smarthire.recruiter.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponseDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String coverLetter;

    // Applicant Profile details
    private ProfileDto candidateProfile;
}
