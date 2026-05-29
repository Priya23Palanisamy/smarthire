package com.smarthire.recruiter.service;

import com.smarthire.auth.entity.User;
import com.smarthire.auth.repository.UserRepository;
import com.smarthire.recruiter.dto.JobPostDto;
import com.smarthire.recruiter.dto.JobResponseDto;
import com.smarthire.recruiter.dto.RecruiterProfileDto;
import com.smarthire.recruiter.entity.Job;
import com.smarthire.recruiter.entity.Recruiter;
import com.smarthire.recruiter.repository.JobRepository;
import com.smarthire.recruiter.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Transactional
    public Recruiter getOrCreateRecruiter(String username) {
        return recruiterRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
                    Recruiter recruiter = Recruiter.builder()
                            .user(user)
                            .companyName("My Company")
                            .companyDescription("Add your company description here.")
                            .contactEmail(user.getEmail())
                            .build();
                    return recruiterRepository.save(recruiter);
                });
    }

    public RecruiterProfileDto getProfile(String username) {
        Recruiter recruiter = getOrCreateRecruiter(username);
        return RecruiterProfileDto.builder()
                .id(recruiter.getId())
                .username(recruiter.getUser().getUsername())
                .companyName(recruiter.getCompanyName())
                .companyLogo(recruiter.getCompanyLogo())
                .website(recruiter.getWebsite())
                .companyDescription(recruiter.getCompanyDescription())
                .companyLocation(recruiter.getCompanyLocation())
                .contactEmail(recruiter.getContactEmail())
                .build();
    }

    @Transactional
    public RecruiterProfileDto updateProfile(String username, RecruiterProfileDto dto) {
        Recruiter recruiter = getOrCreateRecruiter(username);
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setCompanyLogo(dto.getCompanyLogo());
        recruiter.setWebsite(dto.getWebsite());
        recruiter.setCompanyDescription(dto.getCompanyDescription());
        recruiter.setCompanyLocation(dto.getCompanyLocation());
        recruiter.setContactEmail(dto.getContactEmail());
        
        Recruiter saved = recruiterRepository.save(recruiter);
        return RecruiterProfileDto.builder()
                .id(saved.getId())
                .username(saved.getUser().getUsername())
                .companyName(saved.getCompanyName())
                .companyLogo(saved.getCompanyLogo())
                .website(saved.getWebsite())
                .companyDescription(saved.getCompanyDescription())
                .companyLocation(saved.getCompanyLocation())
                .contactEmail(saved.getContactEmail())
                .build();
    }

    @Transactional
    public JobResponseDto createJob(String username, JobPostDto dto) {
        Recruiter recruiter = getOrCreateRecruiter(username);
        Job job = Job.builder()
                .recruiter(recruiter)
                .title(dto.getTitle())
                .salary(dto.getSalary())
                .skills(dto.getSkills())
                .experience(dto.getExperience())
                .location(dto.getLocation())
                .jobType(dto.getJobType())
                .description(dto.getDescription())
                .responsibilities(dto.getResponsibilities())
                .qualification(dto.getQualification())
                .applicationDeadline(dto.getApplicationDeadline())
                .active(dto.isActive())
                .build();

        Job saved = jobRepository.save(job);
        return convertToResponseDto(saved);
    }

    @Transactional
    public JobResponseDto updateJob(String username, Long jobId, JobPostDto dto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        if (!job.getRecruiter().getUser().getUsername().equals(username)) {
            throw new SecurityException("You are not authorized to update this job post!");
        }

        job.setTitle(dto.getTitle());
        job.setSalary(dto.getSalary());
        job.setSkills(dto.getSkills());
        job.setExperience(dto.getExperience());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setDescription(dto.getDescription());
        job.setResponsibilities(dto.getResponsibilities());
        job.setQualification(dto.getQualification());
        job.setApplicationDeadline(dto.getApplicationDeadline());
        job.setActive(dto.isActive());

        Job saved = jobRepository.save(job);
        return convertToResponseDto(saved);
    }

    @Transactional
    public void deleteJob(String username, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        if (!job.getRecruiter().getUser().getUsername().equals(username)) {
            throw new SecurityException("You are not authorized to delete this job post!");
        }

        jobRepository.delete(job);
    }

    public JobResponseDto getJobDetails(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + id));
        return convertToResponseDto(job);
    }

    public List<JobResponseDto> getRecruiterJobs(String username) {
        return jobRepository.findByRecruiterUserUsername(username).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public JobResponseDto convertToResponseDto(Job job) {
        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .salary(job.getSalary())
                .skills(job.getSkills())
                .experience(job.getExperience())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .qualification(job.getQualification())
                .applicationDeadline(job.getApplicationDeadline())
                .active(job.isActive())
                .createdAt(job.getCreatedAt())
                .recruiterId(job.getRecruiter().getId())
                .companyName(job.getRecruiter().getCompanyName())
                .companyLogo(job.getRecruiter().getCompanyLogo())
                .website(job.getRecruiter().getWebsite())
                .build();
    }
}
