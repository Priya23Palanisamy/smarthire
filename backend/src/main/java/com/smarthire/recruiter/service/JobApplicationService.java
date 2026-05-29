package com.smarthire.recruiter.service;

import com.smarthire.auth.entity.User;
import com.smarthire.auth.service.EmailService;
import com.smarthire.profile.dto.ProfileDto;
import com.smarthire.profile.service.ProfileService;
import com.smarthire.recruiter.dto.ApplicationResponseDto;
import com.smarthire.recruiter.dto.StatusUpdateDto;
import com.smarthire.recruiter.entity.JobApplication;
import com.smarthire.recruiter.enums.ApplicationStatus;
import com.smarthire.recruiter.repository.JobApplicationRepository;
import com.smarthire.recruiter.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private EmailService emailService;

    public List<ApplicationResponseDto> getRecruiterApplications(String username) {
        return jobApplicationRepository.findByJobRecruiterUserUsername(username).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getJobApplications(Long jobId, String username) {
        return jobApplicationRepository.findByJobIdAndJobRecruiterUserUsername(jobId, username).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponseDto updateApplicationStatus(String username, Long applicationId, StatusUpdateDto dto) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + applicationId));

        // Ensure current recruiter owns the job
        if (!application.getJob().getRecruiter().getUser().getUsername().equals(username)) {
            throw new SecurityException("You are not authorized to manage applicants for this job post!");
        }

        application.setStatus(dto.getStatus());
        JobApplication saved = jobApplicationRepository.save(application);

        // Dispatch SMTP notification
        sendStatusEmailNotification(saved, dto.getInterviewDetails());

        return convertToResponseDto(saved);
    }

    private void sendStatusEmailNotification(JobApplication app, String interviewDetails) {
        String candidateEmail = app.getUser().getEmail();
        String candidateName = app.getUser().getUsername();
        String jobTitle = app.getJob().getTitle();
        String company = app.getJob().getRecruiter().getCompanyName();
        ApplicationStatus status = app.getStatus();

        String subject = "SmartHire - Job Application Update: " + jobTitle;
        String body = "";

        switch (status) {
            case SHORTLISTED:
                body = String.format("Dear %s,\n\nCongratulations! You have been shortlisted for the position of '%s' at '%s'.\n" +
                        "The hiring team will contact you shortly to coordinate next steps.\n\nBest regards,\nSmartHire Team",
                        candidateName, jobTitle, company);
                break;
            case INTERVIEW_SCHEDULED:
                String details = interviewDetails != null ? interviewDetails : "Details will be shared shortly.";
                body = String.format("Dear %s,\n\nGreat news! An interview has been scheduled for the position of '%s' at '%s'.\n\n" +
                        "Details:\n%s\n\nPlease ensure you are available at the scheduled time.\n\nBest regards,\nSmartHire Team",
                        candidateName, jobTitle, company, details);
                break;
            case REJECTED:
                body = String.format("Dear %s,\n\nThank you for your interest in the position of '%s' at '%s'.\n" +
                        "Unfortunately, after careful consideration of your profile, we have decided to pursue other candidates whose qualifications closely match our current needs.\n\n" +
                        "We wish you all the best in your job search.\n\nBest regards,\nSmartHire Team",
                        candidateName, jobTitle, company);
                break;
            case SELECTED:
                body = String.format("Dear %s,\n\nHearty Congratulations! You have been selected for the position of '%s' at '%s'.\n" +
                        "Our human resources department will follow up with your formal offer details soon.\n\nBest regards,\nSmartHire Team",
                        candidateName, jobTitle, company);
                break;
            default:
                return;
        }

        emailService.sendSimpleEmail(candidateEmail, subject, body);
    }

    private ApplicationResponseDto convertToResponseDto(JobApplication app) {
        // Fetch candidate's modular ProfileDto
        ProfileDto candidateProfile = profileService.getProfileDto(app.getUser().getUsername());

        return ApplicationResponseDto.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .coverLetter(app.getCoverLetter())
                .candidateProfile(candidateProfile)
                .build();
    }
}
