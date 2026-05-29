package com.smarthire.profile.repository;

import com.smarthire.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserUsername(String username);
    Optional<Profile> findByUserId(Long userId);
}
