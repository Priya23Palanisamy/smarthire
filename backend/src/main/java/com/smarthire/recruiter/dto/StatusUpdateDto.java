package com.smarthire.recruiter.dto;

import com.smarthire.recruiter.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateDto {
    @NotNull(message = "Status cannot be null")
    private ApplicationStatus status;

    private String interviewDetails; // Optional interview scheduling info (time, platform, date, link)
}
