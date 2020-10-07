package com.webapp.moviesearch;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {
    private final UserRepository userRepository;
    private final ActiveSessionRepository sessionRepository;

    public UserController(UserRepository userRepository, ActiveSessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/register")
    public ActiveSession registerUser(@RequestBody User user) {
        System.out.println("New register");
        if(userRepository.existsById(user.getId()))
            return new ActiveSession();
        userRepository.saveAndFlush(user);
        return sessionRepository.saveAndFlush(new ActiveSession(user));

    }

    @PostMapping("/login")
    public ActiveSession loginUser(@RequestBody User user) {
        System.out.println("New login");
        Optional<User> resultUser = userRepository.findById(user.getId());
        if(resultUser.isPresent()) {
            System.out.println("User is present");
            if (resultUser.get().equals(user)) {
                System.out.println("User is equals");
                List<ActiveSession> resultSession = sessionRepository.findByUserId(user.getId());
                if(resultSession.size() == 0) {
                    System.out.println("User is not logged in");
                    user.setPassword(null);
                    return sessionRepository.saveAndFlush(new ActiveSession(user));
                }
            }
        }
        // User does not exist or is already logged in
        System.out.println("User not exists or already logged in");
        return new ActiveSession();
    }

    @PostMapping("/logout")
    public void logoutUser(@RequestBody ActiveSession session) {
        Optional<ActiveSession> result = sessionRepository.findById(session.getSessionId());
        if(result.isPresent()) {
            System.out.println("User found");
            sessionRepository.deleteById(session.getSessionId());
            System.out.println("User deleted");
        }
    }

    @DeleteMapping("/user/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}
