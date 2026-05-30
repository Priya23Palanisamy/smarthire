package com.smarthire.jobs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapResponseDto {
    private int matchScore;
    private int totalJobSkills;
    private int matchedCount;
    private int missingCount;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> recommendations;
}
