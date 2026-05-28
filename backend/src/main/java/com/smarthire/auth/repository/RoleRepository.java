package com.smarthire.auth.repository;

import com.smarthire.auth.entity.Role;
import com.smarthire.auth.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(UserRole roleName);
}
