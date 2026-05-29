package com.smarthire.jobs.service;

import com.smarthire.auth.entity.User;
import com.smarthire.auth.repository.UserRepository;
import com.smarthire.jobs.dto.CandidateApplicationResponseDto;
import com.smarthire.jobs.dto.JobApplicationDto;
import com.smarthire.recruiter.entity.Job;
import com.smarthire.recruiter.entity.JobApplication;
import com.smarthire.recruiter.enums.ApplicationStatus;
import com.smarthire.recruiter.repository.JobApplicationRepository;
import com.smarthire.recruiter.repository.JobRepository;
import com.smarthire.recruiter.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationManagerService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterService recruiterService;

    @Transactional
    public CandidateApplicationResponseDto applyForJob(String username, Long jobId, JobApplicationDto dto) {
        // Prevent duplicate application check
        if (jobApplicationRepository.existsByJobIdAndUserUsername(jobId, username)) {
            throw new IllegalArgumentException("You have already applied for this job post!");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job post not found with ID: " + jobId));

        if (!job.isActive()) {
            throw new IllegalArgumentException("This job listing is no longer active!");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        JobApplication application = JobApplication.builder()
                .job(job)
                .user(user)
                .status(ApplicationStatus.APPLIED)
                .coverLetter(dto.getCoverLetter())
                .build();

        JobApplication saved = jobApplicationRepository.save(application);
        return convertToCandidateResponseDto(saved);
    }

    public List<CandidateApplicationResponseDto> getCandidateApplications(String username) {
        return jobApplicationRepository.findByUserUsername(username).stream()
                .map(this::convertToCandidateResponseDto)
                .collect(Collectors.toList());
    }

    public CandidateApplicationResponseDto convertToCandidateResponseDto(JobApplication app) {
        return CandidateApplicationResponseDto.builder()
                .id(app.getId())
                .job(recruiterService.convertToResponseDto(app.getJob()))
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .coverLetter(app.getCoverLetter())
                .build();
    }
}
