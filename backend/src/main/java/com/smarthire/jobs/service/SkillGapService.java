package com.smarthire.jobs.service;

import com.smarthire.jobs.dto.SkillGapResponseDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    /**
     * Calculates the skill gap and matching score between candidate skills and required job skills.
     * This core engine is generic and reusable for candidate ranking, hiring risk, or recommendation engines.
     *
     * @param candidateSkills list of skills the candidate possesses
     * @param requiredSkills list of required skills for the job
     * @return SkillGapResponseDto containing match statistics and learning recommendations
     */
    public SkillGapResponseDto calculateSkillGap(List<String> candidateSkills, List<String> requiredSkills) {
        if (requiredSkills == null) {
            requiredSkills = Collections.emptyList();
        }
        if (candidateSkills == null) {
            candidateSkills = Collections.emptyList();
        }

        // Normalize required skills: trim, ignore empty, deduplicate
        List<String> cleanRequired = requiredSkills.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        if (cleanRequired.isEmpty()) {
            return SkillGapResponseDto.builder()
                    .matchScore(100)
                    .totalJobSkills(0)
                    .matchedCount(0)
                    .missingCount(0)
                    .matchedSkills(Collections.emptyList())
                    .missingSkills(Collections.emptyList())
                    .recommendations(Collections.emptyList())
                    .build();
        }

        // Normalize candidate skills to lowercase for case-insensitive matching
        Set<String> candidateLower = candidateSkills.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String reqSkill : cleanRequired) {
            if (candidateLower.contains(reqSkill.toLowerCase())) {
                matched.add(reqSkill);
            } else {
                missing.add(reqSkill);
            }
        }

        int total = cleanRequired.size();
        int matchedCount = matched.size();
        int missingCount = missing.size();
        int score = (matchedCount * 100) / total;

        List<String> recommendations = missing.stream()
                .map(skill -> "Learn " + skill)
                .collect(Collectors.toList());

        return SkillGapResponseDto.builder()
                .matchScore(score)
                .totalJobSkills(total)
                .matchedCount(matchedCount)
                .missingCount(missingCount)
                .matchedSkills(matched)
                .missingSkills(missing)
                .recommendations(recommendations)
                .build();
    }

    /**
     * Overloaded helper to handle comma-separated raw skills strings.
     */
    public SkillGapResponseDto calculateSkillGap(List<String> candidateSkills, String requiredSkillsRaw) {
        List<String> requiredList = new ArrayList<>();
        if (requiredSkillsRaw != null && !requiredSkillsRaw.trim().isEmpty()) {
            String[] split = requiredSkillsRaw.split(",");
            for (String s : split) {
                requiredList.add(s.trim());
            }
        }
        return calculateSkillGap(candidateSkills, requiredList);
    }
}
