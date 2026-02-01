package com.jobtracker.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.jobtracker.backend.model.JobApplication;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.dto.UpdateJobStatusRequest;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    private final JobApplicationRepository repo;

    public JobApplicationController(JobApplicationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Iterable<JobApplication> getAllJobs() {
        return repo.findAll();
    }

    @PostMapping
    public JobApplication createJob(@RequestBody JobApplication job) {
        return repo.save(job);
    }

    @PutMapping("/{id}/status")
    public JobApplication updateJobStatus(
            @PathVariable Long id,
            @RequestBody UpdateJobStatusRequest request) {
        JobApplication job = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        System.out.println("REQUEST STATUS = " + request.getStatus());

        job.setStatus(request.getStatus());

        JobApplication saved = repo.save(job);

        System.out.println("SAVED STATUS = " + saved.getStatus());

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
