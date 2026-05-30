package com.smarthire.recruiter.service;

import com.smarthire.jobs.dto.SkillGapResponseDto;
import com.smarthire.jobs.service.SkillGapService;
import com.smarthire.profile.dto.ProfileDto;
import com.smarthire.profile.dto.SkillDto;
import com.smarthire.profile.service.ProfileService;
import com.smarthire.recruiter.dto.HiringRiskResponseDto;
import com.smarthire.recruiter.entity.Job;
import com.smarthire.recruiter.entity.JobApplication;
import com.smarthire.recruiter.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class HiringRiskService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private SkillGapService skillGapService;

    /**
     * Calculates the hiring risk score for a job application.
     * Evaluates skill match, candidate vs job experience, and candidate profile completion.
     *
     * @param applicationId ID of the job application
     * @return HiringRiskResponseDto evaluation results
     */
    public HiringRiskResponseDto calculateHiringRisk(Long applicationId) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + applicationId));

        Job job = application.getJob();
        String username = application.getUser().getUsername();
        ProfileDto profile = profileService.getProfileDto(username);

        // 1. Skill Match Score (50% weight)
        List<String> candidateSkills = profile.getSkills().stream()
                .map(SkillDto::getName)
                .collect(Collectors.toList());
        SkillGapResponseDto skillGap = skillGapService.calculateSkillGap(candidateSkills, job.getSkills());
        int skillMatchScore = skillGap.getMatchScore();

        // 2. Experience Match Score (30% weight)
        int candidateExp = profile.getExperienceList().stream()
                .mapToInt(e -> e.getYearsOfExperience() != null ? e.getYearsOfExperience() : 0)
                .sum();
        int requiredExp = parseRequiredExperience(job.getExperience());
        int experienceMatchScore;
        if (requiredExp <= 0) {
            experienceMatchScore = 100;
        } else {
            experienceMatchScore = Math.min((candidateExp * 100) / requiredExp, 100);
        }

        // 3. Profile Completion Score (20% weight)
        int profileCompletionScore = profile.getCompletionPercentage();

        // Overall score logic
        double rawOverall = (skillMatchScore * 0.5) + (experienceMatchScore * 0.3) + (profileCompletionScore * 0.2);
        int overallScore = (int) Math.round(rawOverall);

        String riskCategory;
        if (overallScore <= 40) {
            riskCategory = "High Risk";
        } else if (overallScore <= 70) {
            riskCategory = "Medium Risk";
        } else {
            riskCategory = "Low Risk";
        }

        return HiringRiskResponseDto.builder()
                .overallScore(overallScore)
                .riskCategory(riskCategory)
                .skillMatchScore(skillMatchScore)
                .experienceMatchScore(experienceMatchScore)
                .profileCompletionScore(profileCompletionScore)
                .candidateExperience(candidateExp)
                .requiredExperience(requiredExp)
                .build();
    }

    /**
     * Parses the required experience string to find the minimum numeric requirement.
     */
    private int parseRequiredExperience(String expStr) {
        if (expStr == null || expStr.trim().isEmpty()) {
            return 0;
        }
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(expStr);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group());
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }
}
