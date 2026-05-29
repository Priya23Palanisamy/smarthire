package com.smarthire.recruiter.repository;

import com.smarthire.recruiter.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByJobRecruiterId(Long recruiterId);
    List<JobApplication> findByJobRecruiterUserUsername(String username);
    List<JobApplication> findByJobIdAndJobRecruiterUserUsername(Long jobId, String username);
    long countByJobRecruiterId(Long recruiterId);
    
    // Candidate application lookups
    List<JobApplication> findByUserUsername(String username);
    boolean existsByJobIdAndUserUsername(Long jobId, String username);
}
