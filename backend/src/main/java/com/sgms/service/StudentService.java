package com.sgms.service;

import com.sgms.dto.response.CumulativeResultResponse;
import com.sgms.dto.response.GradeItemResponse;
import com.sgms.dto.response.SemesterResultResponse;
import com.sgms.dto.response.StudentResponse;
import com.sgms.entity.*;
import com.sgms.exception.ResourceNotFoundException;
import com.sgms.exception.UnauthorizedException;
import com.sgms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRecordRepository gradeRecordRepository;
    private final SemesterRepository semesterRepository;
    private final GradeCalculationService gradeCalculationService;
    private final AdminService adminService;

    public StudentService(StudentRepository studentRepository,
                          EnrollmentRepository enrollmentRepository,
                          GradeRecordRepository gradeRecordRepository,
                          SemesterRepository semesterRepository,
                          GradeCalculationService gradeCalculationService,
                          AdminService adminService) {
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRecordRepository = gradeRecordRepository;
        this.semesterRepository = semesterRepository;
        this.gradeCalculationService = gradeCalculationService;
        this.adminService = adminService;
    }

    public Student getStudentForUser(User user) {
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("User is not registered as a student"));
    }

    @Transactional(readOnly = true)
    public StudentResponse getProfile(User user) {
        Student student = getStudentForUser(user);
        return adminService.mapToStudentResponse(student);
    }

    @Transactional(readOnly = true)
    public SemesterResultResponse getSemesterResult(Long semesterId, User user) {
        Student student = getStudentForUser(user);
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found: " + semesterId));

        return buildSemesterResult(student, semester);
    }

    @Transactional(readOnly = true)
    public CumulativeResultResponse getCumulativeResult(User user) {
        Student student = getStudentForUser(user);
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Id(student.getId());

        // Extract distinct semesters student has enrolled in
        Set<Semester> semesters = new TreeSet<>(Comparator.comparing(Semester::getSemesterNumber));
        for (Enrollment e : enrollments) {
            semesters.add(e.getSemester());
        }

        List<SemesterResultResponse> semResults = new ArrayList<>();
        List<GradeCalculationService.SemesterSummary> summaries = new ArrayList<>();
        double totalCreditsAttempted = 0.0;
        double totalCreditsEarned = 0.0;

        for (Semester sem : semesters) {
            SemesterResultResponse res = buildSemesterResult(student, sem);
            semResults.add(res);

            if (res.getTotalCredits() != null) {
                totalCreditsAttempted += res.getTotalCredits();
            }
            if (res.getEarnedCredits() != null) {
                totalCreditsEarned += res.getEarnedCredits();
            }

            if (res.isFullyPublished() && res.getSgpa() != null) {
                summaries.add(new GradeCalculationService.SemesterSummary(
                        res.getTotalCredits(), res.getSgpa(), true));
            }
        }

        Double cgpa = gradeCalculationService.calculateCgpa(summaries);

        CumulativeResultResponse cumulative = new CumulativeResultResponse();
        cumulative.setStudentId(student.getId());
        cumulative.setStudentName(student.getUser().getFullName());
        cumulative.setRollNumber(student.getRollNumber());
        cumulative.setDepartmentName(student.getDepartment().getName());
        cumulative.setCgpa(cgpa);
        cumulative.setTotalCreditsAttempted(totalCreditsAttempted);
        cumulative.setTotalCreditsEarned(totalCreditsEarned);
        cumulative.setSemesterResults(semResults);

        return cumulative;
    }

    @Transactional(readOnly = true)
    public List<Semester> getEnrolledSemesters(User user) {
        Student student = getStudentForUser(user);
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Id(student.getId());
        Set<Semester> set = new TreeSet<>(Comparator.comparing(Semester::getSemesterNumber));
        for (Enrollment e : enrollments) {
            set.add(e.getSemester());
        }
        return new ArrayList<>(set);
    }

    public SemesterResultResponse buildSemesterResult(Student student, Semester semester) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_IdAndSemester_Id(student.getId(), semester.getId());

        List<GradeItemResponse> items = new ArrayList<>();
        List<GradeCalculationService.SubjectCreditGrade> calcItems = new ArrayList<>();

        double totalCredits = 0.0;
        double earnedCredits = 0.0;
        double totalMarksObtained = 0.0;
        double maxMarksPossible = 0.0;
        boolean allPublished = !enrollments.isEmpty();
        boolean hasFailed = false;

        for (Enrollment en : enrollments) {
            totalCredits += en.getSubject().getCredits();
            maxMarksPossible += 100.0;

            Optional<GradeRecord> grOpt = gradeRecordRepository.findByEnrollment_Id(en.getId());

            GradeItemResponse item = new GradeItemResponse();
            item.setEnrollmentId(en.getId());
            item.setStudentId(student.getId());
            item.setStudentName(student.getUser().getFullName());
            item.setRollNumber(student.getRollNumber());
            item.setSubjectId(en.getSubject().getId());
            item.setSubjectCode(en.getSubject().getCode());
            item.setSubjectName(en.getSubject().getName());
            item.setCredits(en.getSubject().getCredits());
            item.setSemesterId(semester.getId());
            item.setSemesterName(semester.getName());
            item.setAcademicYearId(en.getAcademicYear().getId());
            item.setAcademicYearCode(en.getAcademicYear().getYearCode());

            if (grOpt.isPresent() && grOpt.get().isPublished()) {
                GradeRecord gr = grOpt.get();
                item.setGradeRecordId(gr.getId());
                item.setInternalMarks(gr.getInternalMarks());
                item.setExternalMarks(gr.getExternalMarks());
                item.setTotalMarks(gr.getTotalMarks());
                item.setPercentage(gr.getPercentage());
                item.setGrade(gr.getGrade());
                item.setGradePoint(gr.getGradePoint());
                item.setDraft(false);
                item.setPublished(true);
                item.setRemarks(gr.getRemarks());
                item.setPublishedAt(gr.getPublishedAt());

                totalMarksObtained += gr.getTotalMarks() != null ? gr.getTotalMarks() : 0.0;
                boolean isPassed = gr.getGradePoint() != null && gr.getGradePoint() > 0;
                if (isPassed) {
                    earnedCredits += en.getSubject().getCredits();
                } else {
                    hasFailed = true;
                }

                calcItems.add(new GradeCalculationService.SubjectCreditGrade(
                        en.getSubject().getCredits(),
                        gr.getGradePoint() != null ? gr.getGradePoint() : 0.0,
                        true,
                        isPassed
                ));
            } else {
                // Not published yet!
                allPublished = false;
                item.setPublished(false);
                item.setDraft(true);
                item.setRemarks("Result pending publication");
                calcItems.add(new GradeCalculationService.SubjectCreditGrade(
                        en.getSubject().getCredits(), 0.0, false, false));
            }

            items.add(item);
        }

        SemesterResultResponse res = new SemesterResultResponse();
        res.setStudentId(student.getId());
        res.setStudentName(student.getUser().getFullName());
        res.setRollNumber(student.getRollNumber());
        res.setDepartmentName(student.getDepartment().getName());
        res.setSemesterId(semester.getId());
        res.setSemesterNumber(semester.getSemesterNumber());
        res.setSemesterName(semester.getName());
        if (!enrollments.isEmpty()) {
            res.setAcademicYearCode(enrollments.get(0).getAcademicYear().getYearCode());
        }
        res.setSubjects(items);
        res.setTotalCredits(totalCredits);
        res.setEarnedCredits(earnedCredits);
        res.setTotalMarksObtained(Math.round(totalMarksObtained * 10.0) / 10.0);
        res.setMaxMarksPossible(maxMarksPossible);
        res.setOverallPercentage(maxMarksPossible > 0 ? Math.round((totalMarksObtained / maxMarksPossible * 100.0) * 10.0) / 10.0 : 0.0);
        res.setFullyPublished(allPublished);

        if (allPublished && !enrollments.isEmpty()) {
            Double sgpa = gradeCalculationService.calculateSgpa(calcItems);
            res.setSgpa(sgpa);
            res.setResultStatus(hasFailed ? "FAILED" : "PASSED");
        } else {
            res.setSgpa(null); // Do not calculate official GPA from incomplete / unpublished records
            res.setResultStatus("PENDING_PUBLICATION");
        }

        return res;
    }
}

