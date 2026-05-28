package com.smarthire.auth.service;

import com.smarthire.auth.entity.OtpVerification;
import com.smarthire.auth.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;
    
    @Transactional
    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));

        otpRepository.deleteByEmail(email); // Remove old OTP if exists

        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        otpRepository.save(otpVerification);
        emailService.sendOtpEmail(email, otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<OtpVerification> otpOpt = otpRepository.findByEmail(email);
        if (otpOpt.isPresent()) {
            OtpVerification otpVerification = otpOpt.get();
            if (otpVerification.getOtp().equals(otp) && otpVerification.getExpiryTime().isAfter(LocalDateTime.now())) {
                otpVerification.setVerified(true);
                otpRepository.save(otpVerification);
                return true;
            }
        }
        return false;
    }

    public boolean isEmailVerified(String email) {
        return otpRepository.findByEmail(email)
                .map(OtpVerification::isVerified)
                .orElse(false);
    }

    @Transactional
    public void deleteOtp(String email) {
        otpRepository.deleteByEmail(email);
    }
}
