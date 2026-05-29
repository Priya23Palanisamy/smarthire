package com.smarthire.jobs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationDto {
    @NotBlank(message = "Cover letter cannot be blank")
    private String coverLetter;
}
