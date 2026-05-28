package com.smarthire.auth.repository;

import com.smarthire.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByEmail(String email);

    void deleteByEmail(String email);
}
