package com.sgms.service;

import com.sgms.config.JwtTokenProvider;
import com.sgms.dto.request.LoginRequest;
import com.sgms.dto.response.AuthResponse;
import com.sgms.entity.Faculty;
import com.sgms.entity.Role;
import com.sgms.entity.Student;
import com.sgms.entity.User;
import com.sgms.exception.BadRequestException;
import com.sgms.exception.ResourceNotFoundException;
import com.sgms.repository.FacultyRepository;
import com.sgms.repository.StudentRepository;
import com.sgms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       FacultyRepository facultyRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String ipAddress) {
        String identifier = request.getUsername().trim();

        // Find user by username or email or student rollNumber
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }
        if (userOpt.isEmpty()) {
            // Check student roll number
            Optional<Student> studentOpt = studentRepository.findByRollNumber(identifier);
            if (studentOpt.isPresent()) {
                userOpt = Optional.of(studentOpt.get().getUser());
            }
        }
        if (userOpt.isEmpty()) {
            // Check faculty employee ID
            Optional<Faculty> facultyOpt = facultyRepository.findByEmployeeId(identifier);
            if (facultyOpt.isPresent()) {
                userOpt = Optional.of(facultyOpt.get().getUser());
            }
        }

        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid username or password");
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated. Please contact the administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId());

        Long entityId = null;
        String entityCode = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            Optional<Student> s = studentRepository.findByUser(user);
            if (s.isPresent()) {
                entityId = s.get().getId();
                entityCode = s.get().getRollNumber();
            }
        } else if (user.getRole() == Role.ROLE_FACULTY) {
            Optional<Faculty> f = facultyRepository.findByUser(user);
            if (f.isPresent()) {
                entityId = f.get().getId();
                entityCode = f.get().getEmployeeId();
            }
        }

        auditService.log("USER_LOGIN", "User", user.getId(), user.getUsername(), "Successful login", ipAddress);

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                entityId,
                entityCode
        );
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}

