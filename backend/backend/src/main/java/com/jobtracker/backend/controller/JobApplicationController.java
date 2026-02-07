package com.jobtracker.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.jobtracker.backend.model.JobApplication;
import com.jobtracker.backend.repository.JobApplicationRepository;

@RestController
@RequestMapping("/jobs")
public class JobApplicationController {

    private final JobApplicationRepository repository;

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    // GET ALL JOBS
    @GetMapping
    public List<JobApplication> getAllJobs() {
        return repository.findAll();
    }

    // ADD JOB
    @PostMapping
    public JobApplication addJob(@RequestBody JobApplication job) {
        return repository.save(job);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public JobApplication updateStatus(
            @PathVariable Long id,
            @RequestBody JobApplication updatedJob) {

        JobApplication job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setStatus(updatedJob.getStatus());
        return repository.save(job);
    }

    // DELETE JOB
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
