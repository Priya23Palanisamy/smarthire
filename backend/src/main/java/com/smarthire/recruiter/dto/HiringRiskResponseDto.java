package com.smarthire.recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HiringRiskResponseDto {
    private int overallScore;
    private String riskCategory;
    private int skillMatchScore;
    private int experienceMatchScore;
    private int profileCompletionScore;
    private int candidateExperience;
    private int requiredExperience;
}
