package com.smarthire.profile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateDto {
    private Long id;

    @NotBlank(message = "Certificate name is required")
    private String name;

    @NotBlank(message = "Issuer organization is required")
    private String issuer;

    private LocalDate issueDate;

    private String description;
}
