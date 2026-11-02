package com.sgms.service;

import com.sgms.dto.request.FacultyCreateRequest;
import com.sgms.dto.request.ResultPublishRequest;
import com.sgms.dto.request.StudentCreateRequest;
import com.sgms.dto.request.SubjectCreateRequest;
import com.sgms.dto.response.*;
import com.sgms.entity.*;
import com.sgms.exception.BadRequestException;
import com.sgms.exception.ResourceNotFoundException;
import com.sgms.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRecordRepository gradeRecordRepository;
    private final ResultPublicationRepository resultPublicationRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final GradeCalculationService gradeCalculationService;
    private final AuditService auditService;

    public AdminService(UserRepository userRepository,
                        StudentRepository studentRepository,
                        FacultyRepository facultyRepository,
                        DepartmentRepository departmentRepository,
                        SemesterRepository semesterRepository,
                        AcademicYearRepository academicYearRepository,
                        SubjectRepository subjectRepository,
                        EnrollmentRepository enrollmentRepository,
                        GradeRecordRepository gradeRecordRepository,
                        ResultPublicationRepository resultPublicationRepository,
                        AuditLogRepository auditLogRepository,
                        PasswordEncoder passwordEncoder,
                        GradeCalculationService gradeCalculationService,
                        AuditService auditService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.semesterRepository = semesterRepository;
        this.academicYearRepository = academicYearRepository;
        this.subjectRepository = subjectRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRecordRepository = gradeRecordRepository;
        this.resultPublicationRepository = resultPublicationRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.gradeCalculationService = gradeCalculationService;
        this.auditService = auditService;
    }

    // ==========================================
    // DASHBOARD OVERVIEW
    // ==========================================
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalFaculties(facultyRepository.count());
        stats.setTotalSubjects(subjectRepository.count());
        stats.setTotalEnrollments(enrollmentRepository.count());
        stats.setTotalDepartments(departmentRepository.count());

        // Grade distribution
        List<GradeRecord> allGrades = gradeRecordRepository.findAll();
        Map<String, Long> gradeDist = new LinkedHashMap<>();
        gradeDist.put("O", 0L);
        gradeDist.put("A+", 0L);
        gradeDist.put("A", 0L);
        gradeDist.put("B+", 0L);
        gradeDist.put("B", 0L);
        gradeDist.put("C", 0L);
        gradeDist.put("F", 0L);

        for (GradeRecord g : allGrades) {
            if (g.getGrade() != null && gradeDist.containsKey(g.getGrade())) {
                gradeDist.put(g.getGrade(), gradeDist.get(g.getGrade()) + 1);
            }
        }
        stats.setGradeDistribution(gradeDist);

        // Subject performance
        List<Subject> subjects = subjectRepository.findAll();
        List<Map<String, Object>> subjPerf = new ArrayList<>();
        for (Subject sub : subjects) {
            List<GradeRecord> recs = gradeRecordRepository.findByEnrollment_Subject_Id(sub.getId());
            if (!recs.isEmpty()) {
                double avgTotal = recs.stream().mapToDouble(r -> r.getTotalMarks() != null ? r.getTotalMarks() : 0.0).average().orElse(0.0);
                long passed = recs.stream().filter(r -> r.getGradePoint() != null && r.getGradePoint() > 0).count();
                double passRate = (double) passed / recs.size() * 100.0;

                Map<String, Object> map = new HashMap<>();
                map.put("subjectCode", sub.getCode());
                map.put("subjectName", sub.getName());
                map.put("avgScore", Math.round(avgTotal * 10.0) / 10.0);
                map.put("passRate", Math.round(passRate * 10.0) / 10.0);
                map.put("totalStudents", recs.size());
                subjPerf.add(map);
            }
        }
        stats.setSubjectPerformance(subjPerf);

        // Recent activities
        List<AuditLog> recentLogs = auditLogRepository.findTop20ByOrderByTimestampDesc();
        List<Map<String, Object>> actList = recentLogs.stream().map(log -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", log.getId());
            map.put("action", log.getAction());
            map.put("performedBy", log.getPerformedBy());
            map.put("timestamp", log.getTimestamp());
            map.put("details", log.getDetails());
            return map;
        }).collect(Collectors.toList());
        stats.setRecentActivities(actList);

        return stats;
    }

    // ==========================================
    // STUDENT MANAGEMENT
    // ==========================================
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudents(Long departmentId, Long semesterId, Long academicYearId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Student> studentPage = studentRepository.searchStudents(departmentId, semesterId, academicYearId, search, pageable);
        return studentPage.map(this::mapToStudentResponse);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToStudentResponse(student);
    }

    @Transactional
    public StudentResponse createStudent(StudentCreateRequest req, String adminUsername, String ip) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (studentRepository.existsByRollNumber(req.getRollNumber())) {
            throw new BadRequestException("Roll number is already registered");
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester sem = semesterRepository.findById(req.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        AcademicYear year = academicYearRepository.findById(req.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Year not found"));

        String rawPassword = req.getPassword() != null && !req.getPassword().isBlank()
                ? req.getPassword()
                : "Student@" + req.getRollNumber();

        User user = new User(req.getUsername(), req.getEmail(), passwordEncoder.encode(rawPassword), req.getFullName(), Role.ROLE_STUDENT);
        user = userRepository.save(user);

        Student student = new Student(user, req.getRollNumber(), dept, sem, year, req.getPhone(), req.getAddress(), req.getDateOfBirth(), null);
        student = studentRepository.save(student);

        // Auto-enroll student into subjects of that department and semester
        List<Subject> subjects = subjectRepository.findByDepartment_IdAndSemester_Id(dept.getId(), sem.getId());
        for (Subject sub : subjects) {
            Enrollment enrollment = new Enrollment(student, sub, sem, year);
            enrollmentRepository.save(enrollment);
        }

        auditService.log("STUDENT_CREATED", "Student", student.getId(), adminUsername,
                "Created student " + student.getRollNumber() + " (" + user.getFullName() + ")", ip);

        return mapToStudentResponse(student);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentCreateRequest req, String adminUsername, String ip) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        User user = student.getUser();
        if (!user.getEmail().equalsIgnoreCase(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester sem = semesterRepository.findById(req.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));
        AcademicYear year = academicYearRepository.findById(req.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Year not found"));

        student.setDepartment(dept);
        student.setCurrentSemester(sem);
        student.setAcademicYear(year);
        student.setPhone(req.getPhone());
        student.setAddress(req.getAddress());
        student.setDateOfBirth(req.getDateOfBirth());

        student = studentRepository.save(student);

        auditService.log("STUDENT_UPDATED", "Student", student.getId(), adminUsername,
                "Updated details for student " + student.getRollNumber(), ip);

        return mapToStudentResponse(student);
    }

    @Transactional
    public void toggleStudentStatus(Long id, String adminUsername, String ip) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        User user = student.getUser();
        user.setActive(!user.isActive());
        userRepository.save(user);

        auditService.log("STUDENT_STATUS_TOGGLED", "Student", student.getId(), adminUsername,
                "Toggled student " + student.getRollNumber() + " active status to " + user.isActive(), ip);
    }

    @Transactional
    public void deleteStudent(Long id, String adminUsername, String ip) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        // Check if student has enrollments / grades
        List<Enrollment> enrollments = enrollmentRepository.findByStudent_Id(id);
        for (Enrollment e : enrollments) {
            Optional<GradeRecord> gr = gradeRecordRepository.findByEnrollment_Id(e.getId());
            gr.ifPresent(gradeRecordRepository::delete);
            enrollmentRepository.delete(e);
        }

        Long userId = student.getUser().getId();
        studentRepository.delete(student);
        userRepository.deleteById(userId);

        auditService.log("STUDENT_DELETED", "Student", id, adminUsername,
                "Deleted student " + student.getRollNumber(), ip);
    }

    // ==========================================
    // FACULTY MANAGEMENT
    // ==========================================
    @Transactional(readOnly = true)
    public Page<FacultyResponse> getFaculties(Long departmentId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Faculty> facultyPage = facultyRepository.searchFaculties(departmentId, search, pageable);
        return facultyPage.map(this::mapToFacultyResponse);
    }

    @Transactional
    public FacultyResponse createFaculty(FacultyCreateRequest req, String adminUsername, String ip) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (facultyRepository.existsByEmployeeId(req.getEmployeeId())) {
            throw new BadRequestException("Employee ID is already registered");
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        String rawPassword = req.getPassword() != null && !req.getPassword().isBlank()
                ? req.getPassword()
                : "Faculty@123";

        User user = new User(req.getUsername(), req.getEmail(), passwordEncoder.encode(rawPassword), req.getFullName(), Role.ROLE_FACULTY);
        user = userRepository.save(user);

        Faculty faculty = new Faculty(user, req.getEmployeeId(), dept, req.getDesignation(), req.getPhone(), req.getQualification());
        faculty = facultyRepository.save(faculty);

        auditService.log("FACULTY_CREATED", "Faculty", faculty.getId(), adminUsername,
                "Created faculty " + faculty.getEmployeeId() + " (" + user.getFullName() + ")", ip);

        return mapToFacultyResponse(faculty);
    }

    @Transactional
    public FacultyResponse updateFaculty(Long id, FacultyCreateRequest req, String adminUsername, String ip) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));

        User user = faculty.getUser();
        if (!user.getEmail().equalsIgnoreCase(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        faculty.setDepartment(dept);
        faculty.setDesignation(req.getDesignation());
        faculty.setPhone(req.getPhone());
        faculty.setQualification(req.getQualification());

        faculty = facultyRepository.save(faculty);

        auditService.log("FACULTY_UPDATED", "Faculty", faculty.getId(), adminUsername,
                "Updated details for faculty " + faculty.getEmployeeId(), ip);

        return mapToFacultyResponse(faculty);
    }

    @Transactional
    public void toggleFacultyStatus(Long id, String adminUsername, String ip) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));
        User user = faculty.getUser();
        user.setActive(!user.isActive());
        userRepository.save(user);

        auditService.log("FACULTY_STATUS_TOGGLED", "Faculty", faculty.getId(), adminUsername,
                "Toggled faculty " + faculty.getEmployeeId() + " active status to " + user.isActive(), ip);
    }

    // ==========================================
    // SUBJECT MANAGEMENT
    // ==========================================
    @Transactional(readOnly = true)
    public Page<SubjectResponse> getSubjects(Long departmentId, Long semesterId, Long facultyId, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("code").ascending());
        Page<Subject> subjectPage = subjectRepository.searchSubjects(departmentId, semesterId, facultyId, search, pageable);
        return subjectPage.map(this::mapToSubjectResponse);
    }

    @Transactional
    public SubjectResponse createSubject(SubjectCreateRequest req, String adminUsername, String ip) {
        if (subjectRepository.existsByCode(req.getCode())) {
            throw new BadRequestException("Subject code already exists: " + req.getCode());
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester sem = semesterRepository.findById(req.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        Faculty faculty = null;
        if (req.getAssignedFacultyId() != null) {
            faculty = facultyRepository.findById(req.getAssignedFacultyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned faculty not found"));
        }

        Subject subject = new Subject(req.getCode(), req.getName(), req.getCredits(), dept, sem, faculty);
        subject = subjectRepository.save(subject);

        // Auto-enroll existing students in that department and semester
        List<Student> students = studentRepository.findByDepartment_Id(dept.getId()).stream()
                .filter(s -> s.getCurrentSemester().getId().equals(sem.getId()))
                .toList();

        for (Student s : students) {
            Enrollment enrollment = new Enrollment(s, subject, sem, s.getAcademicYear());
            enrollmentRepository.save(enrollment);
        }

        auditService.log("SUBJECT_CREATED", "Subject", subject.getId(), adminUsername,
                "Created subject " + subject.getCode() + " - " + subject.getName(), ip);

        return mapToSubjectResponse(subject);
    }

    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectCreateRequest req, String adminUsername, String ip) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + id));

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester sem = semesterRepository.findById(req.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        Faculty faculty = null;
        if (req.getAssignedFacultyId() != null) {
            faculty = facultyRepository.findById(req.getAssignedFacultyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned faculty not found"));
        }

        subject.setName(req.getName());
        subject.setCredits(req.getCredits());
        subject.setDepartment(dept);
        subject.setSemester(sem);
        subject.setAssignedFaculty(faculty);

        subject = subjectRepository.save(subject);

        auditService.log("SUBJECT_UPDATED", "Subject", subject.getId(), adminUsername,
                "Updated subject " + subject.getCode(), ip);

        return mapToSubjectResponse(subject);
    }

    @Transactional
    public SubjectResponse assignFaculty(Long subjectId, Long facultyId, String adminUsername, String ip) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + subjectId));

        Faculty faculty = null;
        if (facultyId != null) {
            faculty = facultyRepository.findById(facultyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + facultyId));
        }

        subject.setAssignedFaculty(faculty);
        subject = subjectRepository.save(subject);

        auditService.log("SUBJECT_FACULTY_ASSIGNED", "Subject", subject.getId(), adminUsername,
                "Assigned faculty " + (faculty != null ? faculty.getEmployeeId() : "None") + " to subject " + subject.getCode(), ip);

        return mapToSubjectResponse(subject);
    }

    // ==========================================
    // GRADE REVIEW & CORRECTION
    // ==========================================
    @Transactional(readOnly = true)
    public Page<GradeItemResponse> searchGrades(Long subjectId, Long semesterId, Long academicYearId, Boolean isPublished, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<GradeRecord> gradePage = gradeRecordRepository.searchGrades(subjectId, semesterId, academicYearId, isPublished, search, pageable);
        return gradePage.map(this::mapToGradeItemResponse);
    }

    @Transactional
    public GradeItemResponse correctGrade(Long gradeRecordId, Double internalMarks, Double externalMarks, String remarks, String adminUsername, String ip) {
        GradeRecord record = gradeRecordRepository.findById(gradeRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade record not found: " + gradeRecordId));

        String oldValues = String.format("Old: Int=%.2f, Ext=%.2f, Grade=%s",
                record.getInternalMarks(), record.getExternalMarks(), record.getGrade());

        GradeCalculationService.GradeResult calc = gradeCalculationService.calculateGrade(internalMarks, externalMarks);

        record.setInternalMarks(internalMarks);
        record.setExternalMarks(externalMarks);
        record.setTotalMarks(calc.getTotalMarks());
        record.setPercentage(calc.getPercentage());
        record.setGrade(calc.getGrade());
        record.setGradePoint(calc.getGradePoint());
        record.setRemarks(remarks != null ? remarks : "Corrected by admin " + adminUsername);

        record = gradeRecordRepository.save(record);

        String newValues = String.format("New: Int=%.2f, Ext=%.2f, Grade=%s",
                record.getInternalMarks(), record.getExternalMarks(), record.getGrade());

        auditService.log("GRADE_CORRECTED", "GradeRecord", record.getId(), adminUsername,
                "Admin corrected grade for student " + record.getEnrollment().getStudent().getRollNumber() +
                        " in " + record.getEnrollment().getSubject().getCode() + ". " + oldValues + " -> " + newValues + ". Note: " + remarks, ip);

        return mapToGradeItemResponse(record);
    }

    // ==========================================
    // RESULT PUBLICATION
    // ==========================================
    @Transactional
    public Map<String, Object> publishResults(ResultPublishRequest req, User adminUser, String ip) {
        AcademicYear year = academicYearRepository.findById(req.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic Year not found"));
        Semester sem = semesterRepository.findById(req.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        Subject subject = null;
        if (req.getSubjectId() != null) {
            subject = subjectRepository.findById(req.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        }

        // Find relevant grade records and set isPublished
        List<GradeRecord> targetRecords;
        if (subject != null) {
            targetRecords = gradeRecordRepository.findByEnrollment_Subject_IdAndEnrollment_AcademicYear_Id(subject.getId(), year.getId());
        } else {
            // All subjects in that semester
            List<Subject> subjects = subjectRepository.findBySemester_Id(sem.getId());
            targetRecords = new ArrayList<>();
            for (Subject s : subjects) {
                targetRecords.addAll(gradeRecordRepository.findByEnrollment_Subject_IdAndEnrollment_AcademicYear_Id(s.getId(), year.getId()));
            }
        }

        int publishedCount = 0;
        LocalDateTime now = LocalDateTime.now();
        for (GradeRecord gr : targetRecords) {
            // Cannot publish if still in draft
            if (!gr.isDraft() || !req.isPublish()) {
                gr.setPublished(req.isPublish());
                gr.setPublishedAt(req.isPublish() ? now : null);
                gradeRecordRepository.save(gr);
                publishedCount++;
            }
        }

        ResultPublication pub = new ResultPublication(year, sem, subject, req.isPublish(), adminUser);
        resultPublicationRepository.save(pub);

        String scopeStr = subject != null ? ("subject " + subject.getCode()) : ("semester " + sem.getName());
        auditService.log(req.isPublish() ? "RESULTS_PUBLISHED" : "RESULTS_UNPUBLISHED", "ResultPublication", pub.getId(),
                adminUser.getUsername(), (req.isPublish() ? "Published " : "Unpublished ") + publishedCount + " marks for " + scopeStr, ip);

        Map<String, Object> result = new HashMap<>();
        result.put("publishedCount", publishedCount);
        result.put("status", req.isPublish() ? "PUBLISHED" : "UNPUBLISHED");
        result.put("timestamp", now);
        return result;
    }

    // Helper mappers
    public StudentResponse mapToStudentResponse(Student s) {
        StudentResponse r = new StudentResponse();
        r.setId(s.getId());
        r.setUserId(s.getUser().getId());
        r.setUsername(s.getUser().getUsername());
        r.setFullName(s.getUser().getFullName());
        r.setEmail(s.getUser().getEmail());
        r.setRollNumber(s.getRollNumber());
        r.setDepartmentId(s.getDepartment().getId());
        r.setDepartmentCode(s.getDepartment().getCode());
        r.setDepartmentName(s.getDepartment().getName());
        r.setSemesterId(s.getCurrentSemester().getId());
        r.setSemesterNumber(s.getCurrentSemester().getSemesterNumber());
        r.setSemesterName(s.getCurrentSemester().getName());
        r.setAcademicYearId(s.getAcademicYear().getId());
        r.setAcademicYearCode(s.getAcademicYear().getYearCode());
        r.setPhone(s.getPhone());
        r.setAddress(s.getAddress());
        r.setDateOfBirth(s.getDateOfBirth());
        r.setAdmissionDate(s.getAdmissionDate());
        r.setActive(s.getUser().isActive());
        return r;
    }

    public FacultyResponse mapToFacultyResponse(Faculty f) {
        FacultyResponse r = new FacultyResponse();
        r.setId(f.getId());
        r.setUserId(f.getUser().getId());
        r.setUsername(f.getUser().getUsername());
        r.setFullName(f.getUser().getFullName());
        r.setEmail(f.getUser().getEmail());
        r.setEmployeeId(f.getEmployeeId());
        r.setDepartmentId(f.getDepartment().getId());
        r.setDepartmentCode(f.getDepartment().getCode());
        r.setDepartmentName(f.getDepartment().getName());
        r.setDesignation(f.getDesignation());
        r.setPhone(f.getPhone());
        r.setQualification(f.getQualification());
        r.setActive(f.getUser().isActive());
        r.setAssignedSubjectsCount(subjectRepository.findByAssignedFaculty_Id(f.getId()).size());
        return r;
    }

    public SubjectResponse mapToSubjectResponse(Subject s) {
        SubjectResponse r = new SubjectResponse();
        r.setId(s.getId());
        r.setCode(s.getCode());
        r.setName(s.getName());
        r.setCredits(s.getCredits());
        r.setDepartmentId(s.getDepartment().getId());
        r.setDepartmentCode(s.getDepartment().getCode());
        r.setDepartmentName(s.getDepartment().getName());
        r.setSemesterId(s.getSemester().getId());
        r.setSemesterNumber(s.getSemester().getSemesterNumber());
        r.setSemesterName(s.getSemester().getName());
        if (s.getAssignedFaculty() != null) {
            r.setAssignedFacultyId(s.getAssignedFaculty().getId());
            r.setAssignedFacultyName(s.getAssignedFaculty().getUser().getFullName());
            r.setAssignedFacultyEmployeeId(s.getAssignedFaculty().getEmployeeId());
        }
        r.setActive(s.isActive());
        r.setEnrolledStudentsCount(enrollmentRepository.countBySubject_Id(s.getId()));
        return r;
    }

    public GradeItemResponse mapToGradeItemResponse(GradeRecord g) {
        GradeItemResponse r = new GradeItemResponse();
        r.setEnrollmentId(g.getEnrollment().getId());
        r.setGradeRecordId(g.getId());
        r.setStudentId(g.getEnrollment().getStudent().getId());
        r.setStudentName(g.getEnrollment().getStudent().getUser().getFullName());
        r.setRollNumber(g.getEnrollment().getStudent().getRollNumber());
        r.setStudentEmail(g.getEnrollment().getStudent().getUser().getEmail());
        r.setSubjectId(g.getEnrollment().getSubject().getId());
        r.setSubjectCode(g.getEnrollment().getSubject().getCode());
        r.setSubjectName(g.getEnrollment().getSubject().getName());
        r.setCredits(g.getEnrollment().getSubject().getCredits());
        r.setSemesterId(g.getEnrollment().getSemester().getId());
        r.setSemesterName(g.getEnrollment().getSemester().getName());
        r.setAcademicYearId(g.getEnrollment().getAcademicYear().getId());
        r.setAcademicYearCode(g.getEnrollment().getAcademicYear().getYearCode());
        r.setInternalMarks(g.getInternalMarks());
        r.setExternalMarks(g.getExternalMarks());
        r.setTotalMarks(g.getTotalMarks());
        r.setPercentage(g.getPercentage());
        r.setGrade(g.getGrade());
        r.setGradePoint(g.getGradePoint());
        r.setDraft(g.isDraft());
        r.setPublished(g.isPublished());
        r.setRemarks(g.getRemarks());
        if (g.getEvaluatedBy() != null) {
            r.setEvaluatedByName(g.getEvaluatedBy().getUser().getFullName());
        }
        r.setUpdatedAt(g.getUpdatedAt());
        r.setPublishedAt(g.getPublishedAt());
        return r;
    }
}

