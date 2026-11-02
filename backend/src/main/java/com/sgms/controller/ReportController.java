package com.sgms.controller;

import com.sgms.dto.response.GradeItemResponse;
import com.sgms.dto.response.SemesterResultResponse;
import com.sgms.entity.*;
import com.sgms.exception.ResourceNotFoundException;
import com.sgms.exception.UnauthorizedException;
import com.sgms.repository.*;
import com.sgms.service.FacultyService;
import com.sgms.service.PdfGenerationService;
import com.sgms.service.StudentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final StudentService studentService;
    private final FacultyService facultyService;
    private final PdfGenerationService pdfGenerationService;

    public ReportController(StudentRepository studentRepository,
                            SemesterRepository semesterRepository,
                            SubjectRepository subjectRepository,
                            FacultyRepository facultyRepository,
                            StudentService studentService,
                            FacultyService facultyService,
                            PdfGenerationService pdfGenerationService) {
        this.studentRepository = studentRepository;
        this.semesterRepository = semesterRepository;
        this.subjectRepository = subjectRepository;
        this.facultyRepository = facultyRepository;
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.pdfGenerationService = pdfGenerationService;
    }

    @GetMapping("/student/{studentId}/semester/{semesterId}/pdf")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<byte[]> downloadReportCard(
            @PathVariable Long studentId,
            @PathVariable Long semesterId,
            @AuthenticationPrincipal User user) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        // Privacy check: student can only download their own result
        if (user.getRole() == Role.ROLE_STUDENT && !student.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access another student's report card");
        }

        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found: " + semesterId));

        SemesterResultResponse result = studentService.buildSemesterResult(student, semester);
        Double cgpa = studentService.getCumulativeResult(student.getUser()).getCgpa();

        byte[] pdfBytes = pdfGenerationService.generateReportCard(result, cgpa);

        String filename = String.format("ReportCard_%s_Sem%d.pdf",
                student.getRollNumber(), semester.getSemesterNumber());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/subject/{subjectId}/csv")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<byte[]> exportSubjectMarksCsv(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long academicYearId,
            @AuthenticationPrincipal User user) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        // Verify faculty assignment if faculty
        if (user.getRole() == Role.ROLE_FACULTY) {
            Faculty faculty = facultyRepository.findByUser(user)
                    .orElseThrow(() -> new UnauthorizedException("Not a registered faculty"));
            if (subject.getAssignedFaculty() == null || !subject.getAssignedFaculty().getId().equals(faculty.getId())) {
                throw new UnauthorizedException("You are not assigned to this subject");
            }
        }

        List<GradeItemResponse> roster = facultyService.getStudentRosterForSubject(subjectId, academicYearId, user);

        StringBuilder csv = new StringBuilder();
        csv.append("Roll Number,Student Name,Internal (50),External (50),Total (100),Percentage,Grade,Points,Status\n");

        for (GradeItemResponse item : roster) {
            csv.append(escapeCsv(item.getRollNumber())).append(",");
            csv.append(escapeCsv(item.getStudentName())).append(",");
            csv.append(item.getInternalMarks() != null ? item.getInternalMarks() : "").append(",");
            csv.append(item.getExternalMarks() != null ? item.getExternalMarks() : "").append(",");
            csv.append(item.getTotalMarks() != null ? item.getTotalMarks() : "").append(",");
            csv.append(item.getPercentage() != null ? item.getPercentage() : "").append(",");
            csv.append(escapeCsv(item.getGrade() != null ? item.getGrade() : "")).append(",");
            csv.append(item.getGradePoint() != null ? item.getGradePoint() : "").append(",");
            csv.append(item.isPublished() ? "PUBLISHED" : (item.isDraft() ? "DRAFT" : "SUBMITTED")).append("\n");
        }

        byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        String filename = String.format("Marks_%s.csv", subject.getCode());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }

    private String escapeCsv(String data) {
        if (data == null) return "";
        if (data.contains(",") || data.contains("\"") || data.contains("\n")) {
            return "\"" + data.replace("\"", "\"\"") + "\"";
        }
        return data;
    }
}

