package com.sgms.controller;

import com.sgms.dto.response.ApiResponse;
import com.sgms.dto.response.CumulativeResultResponse;
import com.sgms.dto.response.SemesterResultResponse;
import com.sgms.dto.response.StudentResponse;
import com.sgms.entity.Semester;
import com.sgms.entity.User;
import com.sgms.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'FACULTY')")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentResponse>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getProfile(user)));
    }

    @GetMapping("/semesters")
    public ResponseEntity<ApiResponse<List<Semester>>> getEnrolledSemesters(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getEnrolledSemesters(user)));
    }

    @GetMapping("/results/{semesterId}")
    public ResponseEntity<ApiResponse<SemesterResultResponse>> getSemesterResult(
            @PathVariable Long semesterId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getSemesterResult(semesterId, user)));
    }

    @GetMapping("/results/cumulative")
    public ResponseEntity<ApiResponse<CumulativeResultResponse>> getCumulativeResult(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getCumulativeResult(user)));
    }
}

