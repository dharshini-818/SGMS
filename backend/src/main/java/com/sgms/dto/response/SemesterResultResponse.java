package com.sgms.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class SemesterResultResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;
    private Long semesterId;
    private Integer semesterNumber;
    private String semesterName;
    private String academicYearCode;
    private List<GradeItemResponse> subjects;
    private Double totalCredits;
    private Double earnedCredits;
    private Double sgpa; // null if incomplete or unpublished
    private Double totalMarksObtained;
    private Double maxMarksPossible;
    private Double overallPercentage;
    private boolean fullyPublished;
    private String resultStatus; // "PASSED", "FAILED", "PENDING_PUBLICATION"
    private LocalDateTime publishedDate;

    public SemesterResultResponse() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public Integer getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(Integer semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public String getAcademicYearCode() { return academicYearCode; }
    public void setAcademicYearCode(String academicYearCode) { this.academicYearCode = academicYearCode; }

    public List<GradeItemResponse> getSubjects() { return subjects; }
    public void setSubjects(List<GradeItemResponse> subjects) { this.subjects = subjects; }

    public Double getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Double totalCredits) { this.totalCredits = totalCredits; }

    public Double getEarnedCredits() { return earnedCredits; }
    public void setEarnedCredits(Double earnedCredits) { this.earnedCredits = earnedCredits; }

    public Double getSgpa() { return sgpa; }
    public void setSgpa(Double sgpa) { this.sgpa = sgpa; }

    public Double getTotalMarksObtained() { return totalMarksObtained; }
    public void setTotalMarksObtained(Double totalMarksObtained) { this.totalMarksObtained = totalMarksObtained; }

    public Double getMaxMarksPossible() { return maxMarksPossible; }
    public void setMaxMarksPossible(Double maxMarksPossible) { this.maxMarksPossible = maxMarksPossible; }

    public Double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(Double overallPercentage) { this.overallPercentage = overallPercentage; }

    public boolean isFullyPublished() { return fullyPublished; }
    public void setFullyPublished(boolean fullyPublished) { this.fullyPublished = fullyPublished; }

    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }

    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
}

