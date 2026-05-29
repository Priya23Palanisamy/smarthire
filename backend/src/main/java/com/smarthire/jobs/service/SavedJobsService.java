package com.smarthire.jobs.service;

import com.smarthire.auth.entity.User;
import com.smarthire.auth.repository.UserRepository;
import com.smarthire.jobs.entity.SavedJob;
import com.smarthire.jobs.repository.SavedJobRepository;
import com.smarthire.recruiter.dto.JobResponseDto;
import com.smarthire.recruiter.entity.Job;
import com.smarthire.recruiter.repository.JobRepository;
import com.smarthire.recruiter.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobsService {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterService recruiterService;

    @Transactional
    public JobResponseDto saveJob(String username, Long jobId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        if (savedJobRepository.existsByUserUsernameAndJobId(username, jobId)) {
            throw new IllegalArgumentException("You have already saved this job post!");
        }

        SavedJob savedJob = SavedJob.builder()
                .user(user)
                .job(job)
                .build();

        savedJobRepository.save(savedJob);
        return recruiterService.convertToResponseDto(job);
    }

    @Transactional
    public void unsaveJob(String username, Long jobId) {
        SavedJob savedJob = savedJobRepository.findByUserUsernameAndJobId(username, jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job is not currently saved in your profile!"));

        savedJobRepository.delete(savedJob);
    }

    public List<JobResponseDto> getSavedJobs(String username) {
        return savedJobRepository.findByUserUsername(username).stream()
                .map(sj -> recruiterService.convertToResponseDto(sj.getJob()))
                .collect(Collectors.toList());
    }

    public List<Long> getSavedJobIds(String username) {
        return savedJobRepository.findByUserUsername(username).stream()
                .map(sj -> sj.getJob().getId())
                .collect(Collectors.toList());
    }
}
