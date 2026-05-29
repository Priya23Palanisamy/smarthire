package com.smarthire.recruiter.repository;

import com.smarthire.recruiter.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);
    List<Job> findByRecruiterUserUsername(String username);
    long countByRecruiterId(Long recruiterId);
    long countByRecruiterIdAndActive(Long recruiterId, boolean active);
}
