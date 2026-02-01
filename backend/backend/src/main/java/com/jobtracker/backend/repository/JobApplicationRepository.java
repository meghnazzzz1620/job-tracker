package com.jobtracker.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.backend.model.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
}
