package com.smarthire.profile.repository;

import com.smarthire.profile.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByProfileId(Long profileId);
}
