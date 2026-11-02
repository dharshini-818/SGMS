package com.sgms.config;

import com.sgms.entity.*;
import com.sgms.repository.*;
import com.sgms.service.GradeCalculationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;
    private final AcademicYearRepository academicYearRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRecordRepository gradeRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final GradeCalculationService gradeCalculationService;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           SemesterRepository semesterRepository,
                           AcademicYearRepository academicYearRepository,
                           FacultyRepository facultyRepository,
                           StudentRepository studentRepository,
                           SubjectRepository subjectRepository,
                           EnrollmentRepository enrollmentRepository,
                           GradeRecordRepository gradeRecordRepository,
                           PasswordEncoder passwordEncoder,
                           GradeCalculationService gradeCalculationService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.semesterRepository = semesterRepository;
        this.academicYearRepository = academicYearRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRecordRepository = gradeRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.gradeCalculationService = gradeCalculationService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.countByRole(Role.ROLE_ADMIN) > 0) {
            log.info("Database already initialized with administrator account.");
            return;
        }

        log.info("Initializing SGMS Academic Database with base departments, semesters, subjects and demo accounts...");

        // 1. Departments
        Department cse = departmentRepository.save(new Department("CSE", "Computer Science & Engineering", "Department of Computer Science and Engineering"));
        Department ece = departmentRepository.save(new Department("ECE", "Electronics & Communication", "Department of Electronics and Communication Engineering"));
        Department it = departmentRepository.save(new Department("IT", "Information Technology", "Department of Information Technology"));
        Department mech = departmentRepository.save(new Department("MECH", "Mechanical Engineering", "Department of Mechanical Engineering"));

        // 2. Semesters 1 to 8
        Semester sem1 = semesterRepository.save(new Semester(1, "Semester 1"));
        Semester sem2 = semesterRepository.save(new Semester(2, "Semester 2"));
        Semester sem3 = semesterRepository.save(new Semester(3, "Semester 3"));
        Semester sem4 = semesterRepository.save(new Semester(4, "Semester 4"));
        Semester sem5 = semesterRepository.save(new Semester(5, "Semester 5"));
        Semester sem6 = semesterRepository.save(new Semester(6, "Semester 6"));
        Semester sem7 = semesterRepository.save(new Semester(7, "Semester 7"));
        Semester sem8 = semesterRepository.save(new Semester(8, "Semester 8"));

        // 3. Academic Years
        academicYearRepository.save(new AcademicYear("2023-2024", false, LocalDate.of(2023, 7, 1), LocalDate.of(2024, 6, 30)));
        AcademicYear year2425 = academicYearRepository.save(new AcademicYear("2024-2025", true, LocalDate.of(2024, 7, 1), LocalDate.of(2025, 6, 30)));

        // 4. Admin User
        User adminUser = new User("admin", "admin@sgms.edu", passwordEncoder.encode("Admin@123"), "System Administrator", Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 5. Faculty Users
        User facUser1 = new User("prof.sharma", "sharma@sgms.edu", passwordEncoder.encode("Faculty@123"), "Dr. Rajesh Sharma", Role.ROLE_FACULTY);
        userRepository.save(facUser1);
        Faculty faculty1 = facultyRepository.save(new Faculty(facUser1, "FAC-CSE-001", cse, "Professor & HOD", "+91 9876543210", "Ph.D. in Computer Science"));

        User facUser2 = new User("prof.patel", "patel@sgms.edu", passwordEncoder.encode("Faculty@123"), "Prof. Anita Patel", Role.ROLE_FACULTY);
        userRepository.save(facUser2);
        Faculty faculty2 = facultyRepository.save(new Faculty(facUser2, "FAC-CSE-002", cse, "Associate Professor", "+91 9876543211", "M.Tech in Data Science"));

        // 6. Subjects for CSE Sem 1 & Sem 3
        Subject cs101 = subjectRepository.save(new Subject("CS101", "Programming Fundamentals with C", 4.0, cse, sem1, faculty1));
        Subject cs102 = subjectRepository.save(new Subject("CS102", "Mathematics for Computing", 4.0, cse, sem1, faculty2));
        Subject cs103 = subjectRepository.save(new Subject("CS103", "Digital Electronics", 3.0, cse, sem1, faculty1));
        Subject cs104 = subjectRepository.save(new Subject("CS104", "Engineering Physics", 3.0, cse, sem1, faculty2));

        Subject cs301 = subjectRepository.save(new Subject("CS301", "Data Structures & Algorithms", 4.0, cse, sem3, faculty1));
        Subject cs302 = subjectRepository.save(new Subject("CS302", "Database Management Systems", 4.0, cse, sem3, faculty2));
        Subject cs303 = subjectRepository.save(new Subject("CS303", "Object-Oriented Programming (Java)", 4.0, cse, sem3, faculty1));
        Subject cs304 = subjectRepository.save(new Subject("CS304", "Discrete Mathematics", 3.0, cse, sem3, faculty2));

        // 7. Student 1: Alex Chen (CS2024001, Semester 1)
        User stuUser1 = new User("CS2024001", "alex.chen@sgms.edu", passwordEncoder.encode("Student@123"), "Alex Chen", Role.ROLE_STUDENT);
        userRepository.save(stuUser1);
        Student student1 = studentRepository.save(new Student(stuUser1, "CS2024001", cse, sem1, year2425, "+91 9123456780", "12 University Road", LocalDate.of(2004, 3, 15), LocalDate.of(2024, 7, 15)));

        // 8. Student 2: Priya Sharma (CS2024002, Semester 1)
        User stuUser2 = new User("CS2024002", "priya.sharma@sgms.edu", passwordEncoder.encode("Student@123"), "Priya Sharma", Role.ROLE_STUDENT);
        userRepository.save(stuUser2);
        Student student2 = studentRepository.save(new Student(stuUser2, "CS2024002", cse, sem1, year2425, "+91 9123456781", "45 Park Avenue", LocalDate.of(2004, 8, 22), LocalDate.of(2024, 7, 15)));

        // 9. Student 3: David Miller (CS2024003, Semester 1)
        User stuUser3 = new User("CS2024003", "david.miller@sgms.edu", passwordEncoder.encode("Student@123"), "David Miller", Role.ROLE_STUDENT);
        userRepository.save(stuUser3);
        Student student3 = studentRepository.save(new Student(stuUser3, "CS2024003", cse, sem1, year2425, "+91 9123456782", "78 Garden Lane", LocalDate.of(2003, 11, 10), LocalDate.of(2024, 7, 15)));

        // 10. Enrollments & Grade Records for Sem 1
        List<Subject> sem1Subjects = List.of(cs101, cs102, cs103, cs104);
        List<Student> students = List.of(student1, student2, student3);

        double[][] student1Marks = {{46.0, 48.0}, {44.0, 45.0}, {42.0, 43.0}, {45.0, 44.0}}; // Alex: High distinctions (O, A+)
        double[][] student2Marks = {{40.0, 42.0}, {38.0, 40.0}, {37.0, 39.0}, {41.0, 43.0}}; // Priya: A+, A
        double[][] student3Marks = {{35.0, 36.0}, {32.0, 35.0}, {30.0, 33.0}, {34.0, 36.0}}; // David: B+, B

        double[][][] allMarks = {student1Marks, student2Marks, student3Marks};

        for (int sIdx = 0; sIdx < students.size(); sIdx++) {
            Student stu = students.get(sIdx);
            double[][] stuMarks = allMarks[sIdx];

            for (int subIdx = 0; subIdx < sem1Subjects.size(); subIdx++) {
                Subject sub = sem1Subjects.get(subIdx);
                Enrollment en = enrollmentRepository.save(new Enrollment(stu, sub, sem1, year2425));

                double intMarks = stuMarks[subIdx][0];
                double extMarks = stuMarks[subIdx][1];
                GradeCalculationService.GradeResult calc = gradeCalculationService.calculateGrade(intMarks, extMarks);

                // Publish marks for CS101, CS102, CS103, keep CS104 published as well so full report card works!
                GradeRecord gr = new GradeRecord(
                        en, intMarks, extMarks, calc.getTotalMarks(), calc.getPercentage(),
                        calc.getGrade(), calc.getGradePoint(), false, true, sub.getAssignedFaculty(), "Official Published Result"
                );
                gr.setPublishedAt(LocalDateTime.now());
                gradeRecordRepository.save(gr);
            }
        }

        log.info("=================================================================");
        log.info("SGMS Initial Data Setup Completed Successfully!");
        log.info("Default Accounts Created:");
        log.info("ADMIN:   Username: 'admin'       Password: 'Admin@123'");
        log.info("FACULTY: Username: 'prof.sharma' Password: 'Faculty@123'");
        log.info("FACULTY: Username: 'prof.patel'  Password: 'Faculty@123'");
        log.info("STUDENT: Username: 'CS2024001'   Password: 'Student@123'");
        log.info("STUDENT: Username: 'CS2024002'   Password: 'Student@123'");
        log.info("=================================================================");
    }
}

