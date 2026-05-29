package com.smarthire.profile.controller;

import com.smarthire.profile.dto.*;
import com.smarthire.profile.entity.Resume;
import com.smarthire.profile.service.FileStorageService;
import com.smarthire.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private FileStorageService fileStorageService;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.getProfileDto(username));
    }

    @PutMapping("/update")
    public ResponseEntity<ProfileDto> updateProfile(@Valid @RequestBody ProfileUpdateDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.updateProfile(username, dto));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("image") MultipartFile file) {
        String username = getAuthenticatedUsername();
        try {
            // Delete old image if it exists
            ProfileDto current = profileService.getProfileDto(username);
            if (current.getProfileImageUrl() != null) {
                fileStorageService.deleteProfileImage(current.getProfileImageUrl());
            }

            String filename = fileStorageService.storeProfileImage(file);
            ProfileDto updated = profileService.updateProfileImage(username, filename);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/image/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveProfileImage(@PathVariable String filename) {
        try {
            Path file = fileStorageService.loadProfileImage(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("resume") MultipartFile file) {
        String username = getAuthenticatedUsername();
        try {
            // Delete old resume file if it exists
            ProfileDto current = profileService.getProfileDto(username);
            if (current.getResume() != null) {
                fileStorageService.deleteResume(current.getResume().getFileName());
            }

            String filename = fileStorageService.storeResume(file);
            ProfileDto updated = profileService.saveResume(username, filename, filename, file.getContentType());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete-resume")
    public ResponseEntity<?> deleteResume() {
        String username = getAuthenticatedUsername();
        try {
            Resume deleted = profileService.deleteResume(username);
            if (deleted != null) {
                fileStorageService.deleteResume(deleted.getFileName());
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", "Resume deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/download-resume")
    public ResponseEntity<Resource> downloadResume() {
        String username = getAuthenticatedUsername();
        try {
            ProfileDto current = profileService.getProfileDto(username);
            if (current.getResume() == null) {
                return ResponseEntity.notFound().build();
            }
            Path file = fileStorageService.loadResume(current.getResume().getFileName());
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // SKILLS
    @PostMapping("/add-skill")
    public ResponseEntity<ProfileDto> addSkill(@Valid @RequestBody SkillDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.addSkill(username, dto));
    }

    @PutMapping("/update-skill/{id}")
    public ResponseEntity<ProfileDto> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.updateSkill(username, id, dto));
    }

    @DeleteMapping("/delete-skill/{id}")
    public ResponseEntity<ProfileDto> deleteSkill(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.deleteSkill(username, id));
    }

    // EDUCATION
    @PostMapping("/add-education")
    public ResponseEntity<ProfileDto> addEducation(@Valid @RequestBody EducationDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.addEducation(username, dto));
    }

    @PutMapping("/update-education/{id}")
    public ResponseEntity<ProfileDto> updateEducation(@PathVariable Long id, @Valid @RequestBody EducationDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.updateEducation(username, id, dto));
    }

    @DeleteMapping("/delete-education/{id}")
    public ResponseEntity<ProfileDto> deleteEducation(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.deleteEducation(username, id));
    }

    // EXPERIENCE
    @PostMapping("/add-experience")
    public ResponseEntity<ProfileDto> addExperience(@Valid @RequestBody ExperienceDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.addExperience(username, dto));
    }

    @PutMapping("/update-experience/{id}")
    public ResponseEntity<ProfileDto> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.updateExperience(username, id, dto));
    }

    @DeleteMapping("/delete-experience/{id}")
    public ResponseEntity<ProfileDto> deleteExperience(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.deleteExperience(username, id));
    }

    // CERTIFICATES
    @PostMapping("/add-certificate")
    public ResponseEntity<ProfileDto> addCertificate(@Valid @RequestBody CertificateDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.addCertificate(username, dto));
    }

    @PutMapping("/update-certificate/{id}")
    public ResponseEntity<ProfileDto> updateCertificate(@PathVariable Long id, @Valid @RequestBody CertificateDto dto) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.updateCertificate(username, id, dto));
    }

    @DeleteMapping("/delete-certificate/{id}")
    public ResponseEntity<ProfileDto> deleteCertificate(@PathVariable Long id) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(profileService.deleteCertificate(username, id));
    }
}
