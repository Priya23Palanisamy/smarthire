package com.smarthire.recruiter.repository;

import com.smarthire.recruiter.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByUserUsername(String username);
    Optional<Recruiter> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
