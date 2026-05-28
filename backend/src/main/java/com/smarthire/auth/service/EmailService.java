package com.smarthire.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("SmartHire - Your OTP for Verification");
        message.setText("Your OTP for SmartHire is: " + otp + "\nThis OTP is valid for 5 minutes.");
        mailSender.send(message);
    }

    public void sendForgotPasswordEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("SmartHire - Password Reset OTP");
        message.setText("Use this OTP to reset your password: " + otp + "\nIf you didn't request this, please ignore.");
        mailSender.send(message);
    }
}
