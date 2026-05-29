package com.smarthire.jobs.service;

import com.smarthire.recruiter.dto.JobResponseDto;
import com.smarthire.recruiter.entity.Job;
import com.smarthire.recruiter.service.RecruiterService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobSearchService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private RecruiterService recruiterService;

    public List<JobResponseDto> searchActiveJobs(
            String keyword,
            String location,
            String jobType,
            String experience,
            int page,
            int size
    ) {
        StringBuilder jpql = new StringBuilder("SELECT j FROM Job j JOIN FETCH j.recruiter r WHERE j.active = true");
        Map<String, Object> parameters = new HashMap<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String lowerKeyword = "%" + keyword.toLowerCase().trim() + "%";
            jpql.append(" AND (LOWER(j.title) LIKE :keyword")
                .append(" OR LOWER(j.description) LIKE :keyword")
                .append(" OR LOWER(j.skills) LIKE :keyword")
                .append(" OR LOWER(r.companyName) LIKE :keyword)");
            parameters.put("keyword", lowerKeyword);
        }

        if (location != null && !location.trim().isEmpty()) {
            jpql.append(" AND LOWER(j.location) LIKE :location");
            parameters.put("location", "%" + location.toLowerCase().trim() + "%");
        }

        if (jobType != null && !jobType.trim().isEmpty()) {
            jpql.append(" AND j.jobType = :jobType");
            parameters.put("jobType", jobType.trim());
        }

        if (experience != null && !experience.trim().isEmpty()) {
            jpql.append(" AND LOWER(j.experience) LIKE :experience");
            parameters.put("experience", "%" + experience.toLowerCase().trim() + "%");
        }

        jpql.append(" ORDER BY j.createdAt DESC");

        TypedQuery<Job> query = entityManager.createQuery(jpql.toString(), Job.class);
        for (Map.Entry<String, Object> entry : parameters.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        // Pagination
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        return query.getResultList().stream()
                .map(recruiterService::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public JobResponseDto getJobDetails(Long jobId) {
        return recruiterService.getJobDetails(jobId);
    }
}
