package com.smarthire.auth.service;

import com.smarthire.auth.dto.*;
import com.smarthire.auth.entity.Role;
import com.smarthire.auth.entity.User;
import com.smarthire.auth.enums.UserRole;
import com.smarthire.auth.repository.RoleRepository;
import com.smarthire.auth.repository.UserRepository;
import com.smarthire.security.jwt.JwtUtils;
import com.smarthire.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private OtpService otpService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .message("Login Successful")
                .build();
    }

    public String registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (!otpService.isEmailVerified(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email not verified! Please verify OTP first.");
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .isVerified(true)
                .build();

        Set<Role> roles = new HashSet<>();
        UserRole userRole = signUpRequest.getRole() != null ? signUpRequest.getRole() : UserRole.USER;

        Role role = roleRepository.findByRoleName(userRole)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(role);

        user.setRoles(roles);
        userRepository.save(user);
        otpService.deleteOtp(user.getEmail());

        return "User registered successfully!";
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.deleteOtp(request.getEmail());
    }
}
