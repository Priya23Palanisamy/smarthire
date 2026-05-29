package com.smarthire.profile.service;

import com.smarthire.auth.entity.User;
import com.smarthire.auth.repository.UserRepository;
import com.smarthire.profile.dto.*;
import com.smarthire.profile.entity.*;
import com.smarthire.profile.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Transactional
    public Profile getOrCreateProfile(String username) {
        return profileRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
                    Profile profile = Profile.builder()
                            .user(user)
                            .email(user.getEmail())
                            .fullName(user.getUsername())
                            .build();
                    return profileRepository.save(profile);
                });
    }

    public ProfileDto getProfileDto(String username) {
        Profile profile = getOrCreateProfile(username);
        return convertToDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(String username, ProfileUpdateDto dto) {
        Profile profile = getOrCreateProfile(username);

        profile.setFullName(dto.getFullName());
        profile.setGender(dto.getGender());
        profile.setDob(dto.getDob());
        profile.setAddress(dto.getAddress());
        profile.setBio(dto.getBio());
        profile.setEmail(dto.getEmail());
        profile.setPhoneNumber(dto.getPhoneNumber());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());

        Profile saved = profileRepository.save(profile);
        return convertToDto(saved);
    }

    @Transactional
    public ProfileDto updateProfileImage(String username, String imageFilename) {
        Profile profile = getOrCreateProfile(username);
        profile.setProfileImageUrl(imageFilename);
        Profile saved = profileRepository.save(profile);
        return convertToDto(saved);
    }

    @Transactional
    public ProfileDto saveResume(String username, String filename, String filepath, String filetype) {
        Profile profile = getOrCreateProfile(username);
        
        Resume resume = profile.getResume();
        if (resume == null) {
            resume = new Resume();
            resume.setProfile(profile);
        }
        resume.setFileName(filename);
        resume.setFilePath(filepath);
        resume.setFileType(filetype);

        resumeRepository.save(resume);
        profile.setResume(resume);

        return convertToDto(profileRepository.save(profile));
    }

    @Transactional
    public Resume deleteResume(String username) {
        Profile profile = getOrCreateProfile(username);
        Resume resume = profile.getResume();
        if (resume != null) {
            profile.setResume(null);
            profileRepository.save(profile);
            resumeRepository.delete(resume);
        }
        return resume;
    }

    // SKILLS
    @Transactional
    public ProfileDto addSkill(String username, SkillDto dto) {
        Profile profile = getOrCreateProfile(username);
        Skill skill = Skill.builder()
                .profile(profile)
                .name(dto.getName())
                .build();
        skillRepository.save(skill);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto updateSkill(String username, Long skillId, SkillDto dto) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));
        if (!skill.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        skill.setName(dto.getName());
        skillRepository.save(skill);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto deleteSkill(String username, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));
        if (!skill.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        Profile profile = skill.getProfile();
        profile.getSkills().remove(skill);
        profileRepository.save(profile);
        skillRepository.delete(skill);
        return getProfileDto(username);
    }

    // EDUCATION
    @Transactional
    public ProfileDto addEducation(String username, EducationDto dto) {
        Profile profile = getOrCreateProfile(username);
        Education edu = Education.builder()
                .profile(profile)
                .degree(dto.getDegree())
                .college(dto.getCollege())
                .startYear(dto.getStartYear())
                .endYear(dto.getEndYear())
                .cgpa(dto.getCgpa())
                .build();
        educationRepository.save(edu);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto updateEducation(String username, Long eduId, EducationDto dto) {
        Education edu = educationRepository.findById(eduId)
                .orElseThrow(() -> new IllegalArgumentException("Education entry not found"));
        if (!edu.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        edu.setDegree(dto.getDegree());
        edu.setCollege(dto.getCollege());
        edu.setStartYear(dto.getStartYear());
        edu.setEndYear(dto.getEndYear());
        edu.setCgpa(dto.getCgpa());
        educationRepository.save(edu);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto deleteEducation(String username, Long eduId) {
        Education edu = educationRepository.findById(eduId)
                .orElseThrow(() -> new IllegalArgumentException("Education entry not found"));
        if (!edu.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }

        Profile profile = edu.getProfile();
        profile.getEducationList().remove(edu);
        profileRepository.save(profile);
        educationRepository.delete(edu);
        return getProfileDto(username);
    }

    // EXPERIENCE
    @Transactional
    public ProfileDto addExperience(String username, ExperienceDto dto) {
        Profile profile = getOrCreateProfile(username);
        Experience exp = Experience.builder()
                .profile(profile)
                .companyName(dto.getCompanyName())
                .role(dto.getRole())
                .yearsOfExperience(dto.getYearsOfExperience())
                .description(dto.getDescription())
                .build();
        experienceRepository.save(exp);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto updateExperience(String username, Long expId, ExperienceDto dto) {
        Experience exp = experienceRepository.findById(expId)
                .orElseThrow(() -> new IllegalArgumentException("Experience entry not found"));
        if (!exp.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        exp.setCompanyName(dto.getCompanyName());
        exp.setRole(dto.getRole());
        exp.setYearsOfExperience(dto.getYearsOfExperience());
        exp.setDescription(dto.getDescription());
        experienceRepository.save(exp);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto deleteExperience(String username, Long expId) {
        Experience exp = experienceRepository.findById(expId)
                .orElseThrow(() -> new IllegalArgumentException("Experience entry not found"));
        if (!exp.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        Profile profile = exp.getProfile();
        profile.getExperienceList().remove(exp);
        profileRepository.save(profile);
        experienceRepository.delete(exp);
        return getProfileDto(username);
    }

    // CERTIFICATES
    @Transactional
    public ProfileDto addCertificate(String username, CertificateDto dto) {
        Profile profile = getOrCreateProfile(username);
        Certificate cert = Certificate.builder()
                .profile(profile)
                .name(dto.getName())
                .issuer(dto.getIssuer())
                .issueDate(dto.getIssueDate())
                .description(dto.getDescription())
                .build();
        certificateRepository.save(cert);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto updateCertificate(String username, Long certId, CertificateDto dto) {
        Certificate cert = certificateRepository.findById(certId)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        if (!cert.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        cert.setName(dto.getName());
        cert.setIssuer(dto.getIssuer());
        cert.setIssueDate(dto.getIssueDate());
        cert.setDescription(dto.getDescription());
        certificateRepository.save(cert);
        return getProfileDto(username);
    }

    @Transactional
    public ProfileDto deleteCertificate(String username, Long certId) {
        Certificate cert = certificateRepository.findById(certId)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));
        if (!cert.getProfile().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized action");
        }
        Profile profile = cert.getProfile();
        profile.getCertificates().remove(cert);
        profileRepository.save(profile);
        certificateRepository.delete(cert);
        return getProfileDto(username);
    }

    // UTILS & CONVERSION
    private ProfileDto convertToDto(Profile profile) {
        ResumeDto resumeDto = null;
        if (profile.getResume() != null) {
            resumeDto = ResumeDto.builder()
                    .id(profile.getResume().getId())
                    .fileName(profile.getResume().getFileName())
                    .fileType(profile.getResume().getFileType())
                    .build();
        }

        List<SkillDto> skills = profile.getSkills().stream()
                .map(s -> new SkillDto(s.getId(), s.getName()))
                .collect(Collectors.toList());

        List<EducationDto> education = profile.getEducationList().stream()
                .map(e -> new EducationDto(e.getId(), e.getDegree(), e.getCollege(), e.getStartYear(), e.getEndYear(), e.getCgpa()))
                .collect(Collectors.toList());

        List<ExperienceDto> experience = profile.getExperienceList().stream()
                .map(exp -> new ExperienceDto(exp.getId(), exp.getCompanyName(), exp.getRole(), exp.getYearsOfExperience(), exp.getDescription()))
                .collect(Collectors.toList());

        List<CertificateDto> certificates = profile.getCertificates().stream()
                .map(c -> new CertificateDto(c.getId(), c.getName(), c.getIssuer(), c.getIssueDate(), c.getDescription()))
                .collect(Collectors.toList());

        int completion = calculateCompletionPercentage(profile);

        return ProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .username(profile.getUser().getUsername())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .dob(profile.getDob())
                .address(profile.getAddress())
                .bio(profile.getBio())
                .email(profile.getEmail())
                .phoneNumber(profile.getPhoneNumber())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .profileImageUrl(profile.getProfileImageUrl())
                .completionPercentage(completion)
                .resume(resumeDto)
                .skills(skills)
                .educationList(education)
                .experienceList(experience)
                .certificates(certificates)
                .build();
    }

    private int calculateCompletionPercentage(Profile p) {
        int score = 0;
        if (p.getFullName() != null && !p.getFullName().trim().isEmpty()) score += 15;
        if (p.getGender() != null && !p.getGender().trim().isEmpty()) score += 5;
        if (p.getDob() != null) score += 5;
        if (p.getAddress() != null && !p.getAddress().trim().isEmpty()) score += 5;
        if (p.getBio() != null && !p.getBio().trim().isEmpty()) score += 10;
        if (p.getEmail() != null && !p.getEmail().trim().isEmpty()) score += 10;
        if (p.getPhoneNumber() != null && !p.getPhoneNumber().trim().isEmpty()) score += 10;
        if (p.getLinkedinUrl() != null && !p.getLinkedinUrl().trim().isEmpty()) score += 5;
        if (p.getGithubUrl() != null && !p.getGithubUrl().trim().isEmpty()) score += 5;
        if (p.getProfileImageUrl() != null && !p.getProfileImageUrl().trim().isEmpty()) score += 10;
        if (p.getResume() != null) score += 10;
        if (p.getSkills() != null && !p.getSkills().isEmpty()) score += 5;
        if (p.getEducationList() != null && !p.getEducationList().isEmpty()) score += 5;
        if (p.getExperienceList() != null && !p.getExperienceList().isEmpty()) score += 5;
        return Math.min(score, 100);
    }
}
