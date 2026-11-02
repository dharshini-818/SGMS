package com.sgms.service;

import com.sgms.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class GradeCalculationService {

    @Value("${app.grading.max-internal:50.0}")
    private double maxInternalMarks;

    @Value("${app.grading.max-external:50.0}")
    private double maxExternalMarks;

    @Value("${app.grading.pass-marks:40.0}")
    private double passMarks;

    public static class GradeResult {
        private final double totalMarks;
        private final double percentage;
        private final String grade;
        private final double gradePoint;
        private final boolean passed;

        public GradeResult(double totalMarks, double percentage, String grade, double gradePoint, boolean passed) {
            this.totalMarks = round(totalMarks, 2);
            this.percentage = round(percentage, 2);
            this.grade = grade;
            this.gradePoint = round(gradePoint, 1);
            this.passed = passed;
        }

        public double getTotalMarks() { return totalMarks; }
        public double getPercentage() { return percentage; }
        public String getGrade() { return grade; }
        public double getGradePoint() { return gradePoint; }
        public boolean isPassed() { return passed; }
    }

    public static class SubjectCreditGrade {
        private final double credits;
        private final double gradePoint;
        private final boolean isPublished;
        private final boolean isPassed;

        public SubjectCreditGrade(double credits, double gradePoint, boolean isPublished, boolean isPassed) {
            this.credits = credits;
            this.gradePoint = gradePoint;
            this.isPublished = isPublished;
            this.isPassed = isPassed;
        }

        public double getCredits() { return credits; }
        public double getGradePoint() { return gradePoint; }
        public boolean isPublished() { return isPublished; }
        public boolean isPassed() { return isPassed; }
    }

    public static class SemesterSummary {
        private final double credits;
        private final double sgpa;
        private final boolean fullyPublished;

        public SemesterSummary(double credits, double sgpa, boolean fullyPublished) {
            this.credits = credits;
            this.sgpa = sgpa;
            this.fullyPublished = fullyPublished;
        }

        public double getCredits() { return credits; }
        public double getSgpa() { return sgpa; }
        public boolean isFullyPublished() { return fullyPublished; }
    }

    /**
     * Validate and calculate total, percentage, letter grade, and grade point.
     */
    public GradeResult calculateGrade(Double internalMarks, Double externalMarks) {
        if (internalMarks == null) internalMarks = 0.0;
        if (externalMarks == null) externalMarks = 0.0;

        if (internalMarks < 0 || internalMarks > maxInternalMarks) {
            throw new BadRequestException("Internal marks must be between 0 and " + maxInternalMarks);
        }
        if (externalMarks < 0 || externalMarks > maxExternalMarks) {
            throw new BadRequestException("External marks must be between 0 and " + maxExternalMarks);
        }

        double totalMarks = round(internalMarks + externalMarks, 2);
        double maxTotal = maxInternalMarks + maxExternalMarks;
        double percentage = round((totalMarks / maxTotal) * 100.0, 2);

        String grade;
        double gradePoint;

        // Configurable grading scale
        if (percentage >= 90.0) {
            grade = "O";
            gradePoint = 10.0;
        } else if (percentage >= 80.0) {
            grade = "A+";
            gradePoint = 9.0;
        } else if (percentage >= 70.0) {
            grade = "A";
            gradePoint = 8.0;
        } else if (percentage >= 60.0) {
            grade = "B+";
            gradePoint = 7.0;
        } else if (percentage >= 50.0) {
            grade = "B";
            gradePoint = 6.0;
        } else if (percentage >= 40.0) {
            grade = "C";
            gradePoint = 5.0;
        } else {
            grade = "F";
            gradePoint = 0.0;
        }

        boolean passed = totalMarks >= passMarks && !"F".equals(grade);

        return new GradeResult(totalMarks, percentage, grade, gradePoint, passed);
    }

    /**
     * Semester GPA = Sum(GradePoint * Credits) / Sum(Credits)
     * Returns null if any subject in the semester is unpublished or not graded.
     */
    public Double calculateSgpa(List<SubjectCreditGrade> subjects) {
        if (subjects == null || subjects.isEmpty()) {
            return null;
        }

        double totalWeightedPoints = 0.0;
        double totalCredits = 0.0;

        for (SubjectCreditGrade item : subjects) {
            if (!item.isPublished()) {
                // If any subject is not published, official SGPA cannot be determined
                return null;
            }
            totalWeightedPoints += item.getGradePoint() * item.getCredits();
            totalCredits += item.getCredits();
        }

        if (totalCredits <= 0.0) {
            return 0.0;
        }

        return round(totalWeightedPoints / totalCredits, 2);
    }

    /**
     * CGPA = Sum(SGPA * Applicable Semester Credits) / Sum(Applicable Semester Credits)
     */
    public Double calculateCgpa(List<SemesterSummary> semesterSummaries) {
        if (semesterSummaries == null || semesterSummaries.isEmpty()) {
            return null;
        }

        double totalWeightedPoints = 0.0;
        double totalCredits = 0.0;

        for (SemesterSummary sem : semesterSummaries) {
            if (sem.isFullyPublished() && sem.getSgpa() > 0 && sem.getCredits() > 0) {
                totalWeightedPoints += sem.getSgpa() * sem.getCredits();
                totalCredits += sem.getCredits();
            }
        }

        if (totalCredits <= 0.0) {
            return null;
        }

        return round(totalWeightedPoints / totalCredits, 2);
    }

    private static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}

