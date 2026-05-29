package com.smarthire.jobs.dto;

import com.smarthire.recruiter.dto.JobResponseDto;
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
public class CandidateApplicationResponseDto {
    private Long id;
    private JobResponseDto job;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String coverLetter;
}
