package com.smarthire.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = System.getProperty("user.dir") + File.separator + ".." + File.separator + "uploads";
    private final String imageDirName = "profile-images";
    private final String resumeDirName = "resumes";

    public FileStorageService() {
        createDirectories();
    }

    private void createDirectories() {
        try {
            Files.createDirectories(Paths.get(uploadDir, imageDirName));
            Files.createDirectories(Paths.get(uploadDir, resumeDirName));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folders", e);
        }
    }

    public String storeProfileImage(MultipartFile file) {
        // Validation: 2MB max
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("Profile image size exceeds 2MB limit!");
        }

        // Validation: Types
        String extension = getFileExtension(file.getOriginalFilename());
        List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "webp");
        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid profile image type! Allowed: JPG, JPEG, PNG, WEBP");
        }

        return storeFile(file, imageDirName);
    }

    public String storeResume(MultipartFile file) {
        // Validation: 5MB max
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Resume size exceeds 5MB limit!");
        }

        // Validation: Types
        String extension = getFileExtension(file.getOriginalFilename());
        List<String> allowedExtensions = Arrays.asList("pdf", "doc", "docx");
        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid resume file type! Allowed: PDF, DOC, DOCX");
        }

        return storeFile(file, resumeDirName);
    }

    private String storeFile(MultipartFile file, String subfolderName) {
        try {
            String originalFilename = file.getOriginalFilename();
            String cleanFilename = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
            String uniqueFilename = UUID.randomUUID().toString() + "-" + cleanFilename;

            Path targetLocation = Paths.get(uploadDir, subfolderName).resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation);

            return uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public Path loadProfileImage(String filename) {
        return Paths.get(uploadDir, imageDirName).resolve(filename);
    }

    public Path loadResume(String filename) {
        return Paths.get(uploadDir, resumeDirName).resolve(filename);
    }

    public void deleteProfileImage(String filename) {
        try {
            Path file = Paths.get(uploadDir, imageDirName).resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // Log warning
        }
    }

    public void deleteResume(String filename) {
        try {
            Path file = Paths.get(uploadDir, resumeDirName).resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // Log warning
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
