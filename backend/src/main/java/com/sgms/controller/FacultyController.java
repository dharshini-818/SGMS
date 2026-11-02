package com.sgms.controller;

import com.sgms.dto.request.MarksSaveRequest;
import com.sgms.dto.response.ApiResponse;
import com.sgms.dto.response.GradeItemResponse;
import com.sgms.dto.response.SubjectResponse;
import com.sgms.entity.AcademicYear;
import com.sgms.entity.User;
import com.sgms.repository.AcademicYearRepository;
import com.sgms.service.FacultyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/faculty")
@PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
public class FacultyController {

    private final FacultyService facultyService;
    private final AcademicYearRepository academicYearRepository;

    public FacultyController(FacultyService facultyService, AcademicYearRepository academicYearRepository) {
        this.facultyService = facultyService;
        this.academicYearRepository = academicYearRepository;
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAssignedSubjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(facultyService.getAssignedSubjects(user)));
    }

    @GetMapping("/subjects/{subjectId}/roster")
    public ResponseEntity<ApiResponse<List<GradeItemResponse>>> getStudentRoster(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long academicYearId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(facultyService.getStudentRosterForSubject(subjectId, academicYearId, user)));
    }

    @PostMapping("/marks/save")
    public ResponseEntity<ApiResponse<List<GradeItemResponse>>> saveMarks(
            @Valid @RequestBody MarksSaveRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        List<GradeItemResponse> saved = facultyService.saveMarks(req, user, request.getRemoteAddr());
        String msg = req.isDraft() ? "Draft marks saved successfully" : "Marks submitted successfully";
        return ResponseEntity.ok(ApiResponse.ok(msg, saved));
    }

    @GetMapping("/subjects/{subjectId}/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubjectAnalytics(
            @PathVariable Long subjectId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(facultyService.getSubjectAnalytics(subjectId, user)));
    }

    @GetMapping("/academic-years")
    public ResponseEntity<ApiResponse<List<AcademicYear>>> getAcademicYears() {
        return ResponseEntity.ok(ApiResponse.ok(academicYearRepository.findAll()));
    }
}

