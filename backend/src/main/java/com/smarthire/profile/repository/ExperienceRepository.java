package com.smarthire.profile.repository;

import com.smarthire.profile.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByProfileId(Long profileId);
}
