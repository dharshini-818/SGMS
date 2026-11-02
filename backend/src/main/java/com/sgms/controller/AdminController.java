package com.sgms.controller;

import com.sgms.dto.request.FacultyCreateRequest;
import com.sgms.dto.request.ResultPublishRequest;
import com.sgms.dto.request.StudentCreateRequest;
import com.sgms.dto.request.SubjectCreateRequest;
import com.sgms.dto.response.*;
import com.sgms.entity.*;
import com.sgms.repository.AcademicYearRepository;
import com.sgms.repository.DepartmentRepository;
import com.sgms.repository.SemesterRepository;
import com.sgms.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;
    private final AcademicYearRepository academicYearRepository;

    public AdminController(AdminService adminService,
                           DepartmentRepository departmentRepository,
                           SemesterRepository semesterRepository,
                           AcademicYearRepository academicYearRepository) {
        this.adminService = adminService;
        this.departmentRepository = departmentRepository;
        this.semesterRepository = semesterRepository;
        this.academicYearRepository = academicYearRepository;
    }

    // ==========================================
    // DASHBOARD OVERVIEW
    // ==========================================
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboardStats()));
    }

    // ==========================================
    // STUDENT MANAGEMENT
    // ==========================================
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getStudents(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long academicYearId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStudents(departmentId, semesterId, academicYearId, search, page, size)));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getStudentById(id)));
    }

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        StudentResponse res = adminService.createStudent(req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Student created successfully", res));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        StudentResponse res = adminService.updateStudent(id, req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Student updated successfully", res));
    }

    @PatchMapping("/students/{id}/status")
    public ResponseEntity<ApiResponse<String>> toggleStudentStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        adminService.toggleStudentStatus(id, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Student status updated", "Status updated"));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStudent(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        adminService.deleteStudent(id, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Student deleted successfully", "Deleted"));
    }

    // ==========================================
    // FACULTY MANAGEMENT
    // ==========================================
    @GetMapping("/faculties")
    public ResponseEntity<ApiResponse<Page<FacultyResponse>>> getFaculties(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getFaculties(departmentId, search, page, size)));
    }

    @PostMapping("/faculties")
    public ResponseEntity<ApiResponse<FacultyResponse>> createFaculty(
            @Valid @RequestBody FacultyCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        FacultyResponse res = adminService.createFaculty(req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Faculty created successfully", res));
    }

    @PutMapping("/faculties/{id}")
    public ResponseEntity<ApiResponse<FacultyResponse>> updateFaculty(
            @PathVariable Long id,
            @Valid @RequestBody FacultyCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        FacultyResponse res = adminService.updateFaculty(id, req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Faculty updated successfully", res));
    }

    @PatchMapping("/faculties/{id}/status")
    public ResponseEntity<ApiResponse<String>> toggleFacultyStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        adminService.toggleFacultyStatus(id, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Faculty status updated", "Status updated"));
    }

    // ==========================================
    // SUBJECT MANAGEMENT
    // ==========================================
    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<Page<SubjectResponse>>> getSubjects(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long facultyId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getSubjects(departmentId, semesterId, facultyId, search, page, size)));
    }

    @PostMapping("/subjects")
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(
            @Valid @RequestBody SubjectCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        SubjectResponse res = adminService.createSubject(req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Subject created successfully", res));
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectCreateRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        SubjectResponse res = adminService.updateSubject(id, req, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Subject updated successfully", res));
    }

    @PostMapping("/subjects/{id}/assign-faculty")
    public ResponseEntity<ApiResponse<SubjectResponse>> assignFaculty(
            @PathVariable Long id,
            @RequestParam(required = false) Long facultyId,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        SubjectResponse res = adminService.assignFaculty(id, facultyId, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Faculty assigned successfully", res));
    }

    // ==========================================
    // ACADEMIC DATA (DEPARTMENTS, SEMESTERS, YEARS)
    // ==========================================
    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(departmentRepository.findAll()));
    }

    @PostMapping("/departments")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(ApiResponse.ok("Department created", departmentRepository.save(dept)));
    }

    @GetMapping("/semesters")
    public ResponseEntity<ApiResponse<List<Semester>>> getSemesters() {
        return ResponseEntity.ok(ApiResponse.ok(semesterRepository.findAll()));
    }

    @GetMapping("/academic-years")
    public ResponseEntity<ApiResponse<List<AcademicYear>>> getAcademicYears() {
        return ResponseEntity.ok(ApiResponse.ok(academicYearRepository.findAll()));
    }

    // ==========================================
    // GRADE REVIEW & CORRECTION
    // ==========================================
    @GetMapping("/grades")
    public ResponseEntity<ApiResponse<Page<GradeItemResponse>>> getGrades(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long academicYearId,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.searchGrades(subjectId, semesterId, academicYearId, isPublished, search, page, size)));
    }

    @PutMapping("/grades/{id}/correct")
    public ResponseEntity<ApiResponse<GradeItemResponse>> correctGrade(
            @PathVariable Long id,
            @RequestParam Double internalMarks,
            @RequestParam Double externalMarks,
            @RequestParam(required = false) String remarks,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        GradeItemResponse res = adminService.correctGrade(id, internalMarks, externalMarks, remarks, user.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Grade corrected successfully", res));
    }

    // ==========================================
    // RESULT PUBLICATION
    // ==========================================
    @PostMapping("/results/publish")
    public ResponseEntity<ApiResponse<Map<String, Object>>> publishResults(
            @Valid @RequestBody ResultPublishRequest req,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        Map<String, Object> res = adminService.publishResults(req, user, request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok(req.isPublish() ? "Results published successfully" : "Results unpublished", res));
    }
}

