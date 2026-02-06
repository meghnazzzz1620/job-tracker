package com.jobtracker.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.jobtracker.backend.model.User;
import com.jobtracker.backend.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // SIGNUP
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "EMAIL_EXISTS";
        }
        userRepository.save(user);
        return "SIGNUP_SUCCESS";
    }

    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userRepository.findByEmail(user.getEmail())
                .filter(u -> u.getPassword().equals(user.getPassword()))
                .map(u -> "LOGIN_SUCCESS")
                .orElse("INVALID_CREDENTIALS");
    }
}
