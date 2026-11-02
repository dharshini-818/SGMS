package com.sgms.dto.response;

import java.util.List;

public class CumulativeResultResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;
    private Double cgpa;
    private Double totalCreditsAttempted;
    private Double totalCreditsEarned;
    private List<SemesterResultResponse> semesterResults;

    public CumulativeResultResponse() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Double getTotalCreditsAttempted() { return totalCreditsAttempted; }
    public void setTotalCreditsAttempted(Double totalCreditsAttempted) { this.totalCreditsAttempted = totalCreditsAttempted; }

    public Double getTotalCreditsEarned() { return totalCreditsEarned; }
    public void setTotalCreditsEarned(Double totalCreditsEarned) { this.totalCreditsEarned = totalCreditsEarned; }

    public List<SemesterResultResponse> getSemesterResults() { return semesterResults; }
    public void setSemesterResults(List<SemesterResultResponse> semesterResults) { this.semesterResults = semesterResults; }
}

