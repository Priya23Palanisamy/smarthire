package com.smarthire.jobs.repository;

import com.smarthire.jobs.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserId(Long userId);
    List<SavedJob> findByUserUsername(String username);
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);
    Optional<SavedJob> findByUserUsernameAndJobId(String username, Long jobId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    boolean existsByUserUsernameAndJobId(String username, Long jobId);
}
