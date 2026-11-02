package com.sgms.service;

import com.sgms.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GradeCalculationServiceTest {

    private GradeCalculationService gradingService;

    @BeforeEach
    void setUp() {
        gradingService = new GradeCalculationService();
        ReflectionTestUtils.setField(gradingService, "maxInternalMarks", 50.0);
        ReflectionTestUtils.setField(gradingService, "maxExternalMarks", 50.0);
        ReflectionTestUtils.setField(gradingService, "passMarks", 40.0);
    }

    @Test
    @DisplayName("Grade 'O' (Outstanding) for 90-100 marks")
    void testOutstandingGrade() {
        GradeCalculationService.GradeResult res = gradingService.calculateGrade(48.0, 47.0);
        assertEquals(95.0, res.getTotalMarks());
        assertEquals(95.0, res.getPercentage());
        assertEquals("O", res.getGrade());
        assertEquals(10.0, res.getGradePoint());
        assertTrue(res.isPassed());
    }

    @Test
    @DisplayName("Grade 'A+' for 80-89 marks")
    void testAplusGrade() {
        GradeCalculationService.GradeResult res = gradingService.calculateGrade(42.0, 43.0);
        assertEquals(85.0, res.getTotalMarks());
        assertEquals("A+", res.getGrade());
        assertEquals(9.0, res.getGradePoint());
        assertTrue(res.isPassed());
    }

    @Test
    @DisplayName("Grade 'A' for 70-79 marks")
    void testAGrade() {
        GradeCalculationService.GradeResult res = gradingService.calculateGrade(38.0, 37.0);
        assertEquals(75.0, res.getTotalMarks());
        assertEquals("A", res.getGrade());
        assertEquals(8.0, res.getGradePoint());
        assertTrue(res.isPassed());
    }

    @Test
    @DisplayName("Grade 'C' at pass boundary 40 marks")
    void testBoundaryPassGrade() {
        GradeCalculationService.GradeResult res = gradingService.calculateGrade(20.0, 20.0);
        assertEquals(40.0, res.getTotalMarks());
        assertEquals("C", res.getGrade());
        assertEquals(5.0, res.getGradePoint());
        assertTrue(res.isPassed());
    }

    @Test
    @DisplayName("Grade 'F' (Fail) for marks below 40")
    void testFailGrade() {
        GradeCalculationService.GradeResult res = gradingService.calculateGrade(15.0, 20.0);
        assertEquals(35.0, res.getTotalMarks());
        assertEquals("F", res.getGrade());
        assertEquals(0.0, res.getGradePoint());
        assertFalse(res.isPassed());
    }

    @Test
    @DisplayName("Validation rejects negative marks")
    void testNegativeMarksRejection() {
        assertThrows(BadRequestException.class, () -> gradingService.calculateGrade(-5.0, 30.0));
        assertThrows(BadRequestException.class, () -> gradingService.calculateGrade(30.0, -1.0));
    }

    @Test
    @DisplayName("Validation rejects marks over 50.0")
    void testExceededMarksRejection() {
        assertThrows(BadRequestException.class, () -> gradingService.calculateGrade(55.0, 30.0));
        assertThrows(BadRequestException.class, () -> gradingService.calculateGrade(30.0, 50.1));
    }

    @Test
    @DisplayName("SGPA Calculation with Subject Credit Weighting")
    void testSgpaCalculation() {
        // Subject 1: 4 credits, Grade Point 10.0 (O)
        // Subject 2: 3 credits, Grade Point 8.0 (A)
        // Weighted sum = (4 * 10) + (3 * 8) = 40 + 24 = 64
        // Total credits = 7
        // Expected SGPA = 64 / 7 = 9.14
        List<GradeCalculationService.SubjectCreditGrade> subjects = List.of(
                new GradeCalculationService.SubjectCreditGrade(4.0, 10.0, true, true),
                new GradeCalculationService.SubjectCreditGrade(3.0, 8.0, true, true)
        );

        Double sgpa = gradingService.calculateSgpa(subjects);
        assertNotNull(sgpa);
        assertEquals(9.14, sgpa);
    }

    @Test
    @DisplayName("SGPA returns null if any subject is not yet published")
    void testSgpaWithUnpublishedSubject() {
        List<GradeCalculationService.SubjectCreditGrade> subjects = List.of(
                new GradeCalculationService.SubjectCreditGrade(4.0, 10.0, true, true),
                new GradeCalculationService.SubjectCreditGrade(3.0, 8.0, false, false) // Unpublished!
        );

        Double sgpa = gradingService.calculateSgpa(subjects);
        assertNull(sgpa, "SGPA must not be calculated when a subject is unpublished");
    }

    @Test
    @DisplayName("CGPA Calculation across multiple published semesters")
    void testCgpaCalculation() {
        // Sem 1: 20 credits, SGPA 8.5 -> 170.0
        // Sem 2: 20 credits, SGPA 9.0 -> 180.0
        // Total points = 350.0 / 40 = 8.75
        List<GradeCalculationService.SemesterSummary> semList = List.of(
                new GradeCalculationService.SemesterSummary(20.0, 8.5, true),
                new GradeCalculationService.SemesterSummary(20.0, 9.0, true)
        );

        Double cgpa = gradingService.calculateCgpa(semList);
        assertNotNull(cgpa);
        assertEquals(8.75, cgpa);
    }
}

