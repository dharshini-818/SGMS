package com.sgms.service;

import com.sgms.dto.request.MarksEntryItem;
import com.sgms.dto.request.MarksSaveRequest;
import com.sgms.dto.response.GradeItemResponse;
import com.sgms.dto.response.SubjectResponse;
import com.sgms.entity.*;
import com.sgms.exception.BadRequestException;
import com.sgms.exception.ResourceNotFoundException;
import com.sgms.exception.UnauthorizedException;
import com.sgms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRecordRepository gradeRecordRepository;
    private final AcademicYearRepository academicYearRepository;
    private final GradeCalculationService gradeCalculationService;
    private final AuditService auditService;
    private final AdminService adminService;

    public FacultyService(FacultyRepository facultyRepository,
                          SubjectRepository subjectRepository,
                          EnrollmentRepository enrollmentRepository,
                          GradeRecordRepository gradeRecordRepository,
                          AcademicYearRepository academicYearRepository,
                          GradeCalculationService gradeCalculationService,
                          AuditService auditService,
                          AdminService adminService) {
        this.facultyRepository = facultyRepository;
        this.subjectRepository = subjectRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRecordRepository = gradeRecordRepository;
        this.academicYearRepository = academicYearRepository;
        this.gradeCalculationService = gradeCalculationService;
        this.auditService = auditService;
        this.adminService = adminService;
    }

    private Faculty getFacultyForUser(User user) {
        return facultyRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("User is not registered as a faculty member"));
    }

    private void verifyFacultyAssignment(Faculty faculty, Subject subject) {
        if (subject.getAssignedFaculty() == null || !subject.getAssignedFaculty().getId().equals(faculty.getId())) {
            throw new UnauthorizedException("You are not assigned to teach subject: " + subject.getCode() + " - " + subject.getName());
        }
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getAssignedSubjects(User user) {
        Faculty faculty = getFacultyForUser(user);
        List<Subject> subjects = subjectRepository.findByAssignedFaculty_Id(faculty.getId());
        return subjects.stream().map(adminService::mapToSubjectResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<GradeItemResponse> getStudentRosterForSubject(Long subjectId, Long academicYearId, User user) {
        Faculty faculty = getFacultyForUser(user);
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        verifyFacultyAssignment(faculty, subject);

        AcademicYear year = academicYearId != null
                ? academicYearRepository.findById(academicYearId).orElse(null)
                : academicYearRepository.findByIsCurrentTrue().orElse(null);

        List<Enrollment> enrollments = year != null
                ? enrollmentRepository.findBySubject_IdAndAcademicYear_Id(subjectId, year.getId())
                : enrollmentRepository.findBySubject_Id(subjectId);

        List<GradeItemResponse> roster = new ArrayList<>();
        for (Enrollment en : enrollments) {
            Optional<GradeRecord> grOpt = gradeRecordRepository.findByEnrollment_Id(en.getId());

            GradeItemResponse item = new GradeItemResponse();
            item.setEnrollmentId(en.getId());
            item.setStudentId(en.getStudent().getId());
            item.setStudentName(en.getStudent().getUser().getFullName());
            item.setRollNumber(en.getStudent().getRollNumber());
            item.setStudentEmail(en.getStudent().getUser().getEmail());
            item.setSubjectId(subject.getId());
            item.setSubjectCode(subject.getCode());
            item.setSubjectName(subject.getName());
            item.setCredits(subject.getCredits());
            item.setSemesterId(en.getSemester().getId());
            item.setSemesterName(en.getSemester().getName());
            item.setAcademicYearId(en.getAcademicYear().getId());
            item.setAcademicYearCode(en.getAcademicYear().getYearCode());

            if (grOpt.isPresent()) {
                GradeRecord gr = grOpt.get();
                item.setGradeRecordId(gr.getId());
                item.setInternalMarks(gr.getInternalMarks());
                item.setExternalMarks(gr.getExternalMarks());
                item.setTotalMarks(gr.getTotalMarks());
                item.setPercentage(gr.getPercentage());
                item.setGrade(gr.getGrade());
                item.setGradePoint(gr.getGradePoint());
                item.setDraft(gr.isDraft());
                item.setPublished(gr.isPublished());
                item.setRemarks(gr.getRemarks());
                item.setUpdatedAt(gr.getUpdatedAt());
                item.setPublishedAt(gr.getPublishedAt());
            } else {
                item.setDraft(true);
                item.setPublished(false);
            }
            roster.add(item);
        }

        // Sort by student roll number
        roster.sort(Comparator.comparing(GradeItemResponse::getRollNumber));
        return roster;
    }

    @Transactional
    public List<GradeItemResponse> saveMarks(MarksSaveRequest req, User user, String ip) {
        Faculty faculty = getFacultyForUser(user);
        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + req.getSubjectId()));

        verifyFacultyAssignment(faculty, subject);

        List<GradeItemResponse> savedList = new ArrayList<>();
        int count = 0;

        for (MarksEntryItem item : req.getMarksList()) {
            Enrollment enrollment = enrollmentRepository.findById(item.getEnrollmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + item.getEnrollmentId()));

            // Verify enrollment is for this subject
            if (!enrollment.getSubject().getId().equals(subject.getId())) {
                throw new BadRequestException("Enrollment ID " + item.getEnrollmentId() + " does not belong to subject " + subject.getCode());
            }

            Optional<GradeRecord> existingOpt = gradeRecordRepository.findByEnrollment_Id(enrollment.getId());
            GradeRecord record = existingOpt.orElseGet(() -> {
                GradeRecord nr = new GradeRecord();
                nr.setEnrollment(enrollment);
                return nr;
            });

            // If already published, faculty cannot alter it without admin override
            if (record.isPublished()) {
                throw new BadRequestException("Marks for student " + enrollment.getStudent().getRollNumber() +
                        " are already published. Alterations require authorized administrator workflow.");
            }

            // Calculation
            GradeCalculationService.GradeResult calc = gradeCalculationService.calculateGrade(
                    item.getInternalMarks(), item.getExternalMarks());

            record.setInternalMarks(item.getInternalMarks());
            record.setExternalMarks(item.getExternalMarks());
            record.setTotalMarks(calc.getTotalMarks());
            record.setPercentage(calc.getPercentage());
            record.setGrade(calc.getGrade());
            record.setGradePoint(calc.getGradePoint());
            record.setDraft(req.isDraft());
            record.setRemarks(item.getRemarks());
            record.setEvaluatedBy(faculty);

            record = gradeRecordRepository.save(record);
            savedList.add(adminService.mapToGradeItemResponse(record));
            count++;
        }

        String action = req.isDraft() ? "MARKS_DRAFT_SAVED" : "MARKS_SUBMITTED";
        String status = req.isDraft() ? "draft" : "submitted";
        auditService.log(action, "Subject", subject.getId(), user.getUsername(),
                "Faculty saved " + count + " marks records as " + status + " for " + subject.getCode(), ip);

        return savedList;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSubjectAnalytics(Long subjectId, User user) {
        Faculty faculty = getFacultyForUser(user);
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        verifyFacultyAssignment(faculty, subject);

        List<GradeRecord> records = gradeRecordRepository.findByEnrollment_Subject_Id(subjectId);

        Map<String, Long> gradeDist = new LinkedHashMap<>();
        gradeDist.put("O", 0L);
        gradeDist.put("A+", 0L);
        gradeDist.put("A", 0L);
        gradeDist.put("B+", 0L);
        gradeDist.put("B", 0L);
        gradeDist.put("C", 0L);
        gradeDist.put("F", 0L);

        double totalMarksSum = 0;
        int gradedCount = 0;
        int passedCount = 0;

        for (GradeRecord r : records) {
            if (r.getGrade() != null) {
                gradeDist.put(r.getGrade(), gradeDist.getOrDefault(r.getGrade(), 0L) + 1);
                if (r.getTotalMarks() != null) {
                    totalMarksSum += r.getTotalMarks();
                    gradedCount++;
                }
                if (r.getGradePoint() != null && r.getGradePoint() > 0) {
                    passedCount++;
                }
            }
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("subjectCode", subject.getCode());
        analytics.put("subjectName", subject.getName());
        analytics.put("totalEnrolled", enrollmentRepository.countBySubject_Id(subjectId));
        analytics.put("totalGraded", gradedCount);
        analytics.put("averageMarks", gradedCount > 0 ? Math.round((totalMarksSum / gradedCount) * 10.0) / 10.0 : 0.0);
        analytics.put("passRate", gradedCount > 0 ? Math.round(((double) passedCount / gradedCount * 100.0) * 10.0) / 10.0 : 0.0);
        analytics.put("gradeDistribution", gradeDist);

        return analytics;
    }
}

