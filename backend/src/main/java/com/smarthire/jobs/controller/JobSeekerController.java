package com.smarthire.jobs.controller;

import com.smarthire.jobs.dto.CandidateApplicationResponseDto;
import com.smarthire.jobs.dto.JobApplicationDto;
import com.smarthire.jobs.dto.SkillGapResponseDto;
import com.smarthire.jobs.service.JobApplicationManagerService;
import com.smarthire.jobs.service.JobSearchService;
import com.smarthire.jobs.service.SavedJobsService;
import com.smarthire.jobs.service.SkillGapService;
import com.smarthire.profile.dto.ProfileDto;
import com.smarthire.profile.dto.SkillDto;
import com.smarthire.profile.service.ProfileService;
import com.smarthire.recruiter.dto.JobResponseDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobSeekerController {

    @Autowired
    private JobSearchService jobSearchService;

    @Autowired
    private JobApplicationManagerService jobApplicationManagerService;

    @Autowired
    private SavedJobsService savedJobsService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private SkillGapService skillGapService;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }


    // PUBLIC ENDPOINTS
    @GetMapping
    public ResponseEntity<List<JobResponseDto>> getActiveJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<JobResponseDto> jobs = jobSearchService.searchActiveJobs(keyword, location, jobType, experience, page, size);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobSearchService.getJobDetails(id));
    }

    // AUTHENTICATED JOB SEEKER ENDPOINTS
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobApplicationDto dto
    ) {
        try {
            String username = getAuthenticatedUsername();
            CandidateApplicationResponseDto app = jobApplicationManagerService.applyForJob(username, jobId, dto);
            return ResponseEntity.ok(app);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<CandidateApplicationResponseDto>> getMyApplications() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(jobApplicationManagerService.getCandidateApplications(username));
    }

    @PostMapping("/save/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId) {
        try {
            String username = getAuthenticatedUsername();
            JobResponseDto saved = savedJobsService.saveJob(username, jobId);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/unsave/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId) {
        try {
            String username = getAuthenticatedUsername();
            savedJobsService.unsaveJob(username, jobId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Job removed from saved list");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/saved")
    public ResponseEntity<List<JobResponseDto>> getSavedJobs() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(savedJobsService.getSavedJobs(username));
    }

    @GetMapping("/saved-ids")
    public ResponseEntity<List<Long>> getSavedJobIds() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(savedJobsService.getSavedJobIds(username));
    }

    @GetMapping("/{id}/skill-gap")
    public ResponseEntity<?> getJobSkillGap(@PathVariable Long id) {
        try {
            String username = getAuthenticatedUsername();
            ProfileDto profileDto = profileService.getProfileDto(username);
            List<String> candidateSkills = profileDto.getSkills().stream()
                    .map(SkillDto::getName)
                    .collect(Collectors.toList());

            JobResponseDto job = jobSearchService.getJobDetails(id);
            SkillGapResponseDto skillGap = skillGapService.calculateSkillGap(candidateSkills, job.getSkills());
            return ResponseEntity.ok(skillGap);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

