package com.smarthire.recruiter.controller;

import com.smarthire.recruiter.dto.*;
import com.smarthire.recruiter.service.JobApplicationService;
import com.smarthire.recruiter.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private JobApplicationService jobApplicationService;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // PROFILE APIS
    @PostMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> createProfile(@Valid @RequestBody RecruiterProfileDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.updateProfile(username, dto));
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.getProfile(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(@Valid @RequestBody RecruiterProfileDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.updateProfile(username, dto));
    }

    // JOB CRUD APIS
    @PostMapping("/jobs")
    public ResponseEntity<JobResponseDto> createJob(@Valid @RequestBody JobPostDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.createJob(username, dto));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDto>> getMyJobs() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.getRecruiterJobs(username));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(recruiterService.getJobDetails(id));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobResponseDto> updateJob(@PathVariable Long id, @Valid @RequestBody JobPostDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(recruiterService.updateJob(username, id, dto));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        try {
            recruiterService.deleteJob(username, id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Job deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // APPLICATIONS APIS
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponseDto>> getApplications() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(jobApplicationService.getRecruiterApplications(username));
    }

    @GetMapping("/jobs/{id}/applications")
    public ResponseEntity<List<ApplicationResponseDto>> getJobApplications(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(jobApplicationService.getJobApplications(id, username));
    }

    @PutMapping("/application-status/{id}")
    public ResponseEntity<ApplicationResponseDto> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(username, id, dto));
    }
}
