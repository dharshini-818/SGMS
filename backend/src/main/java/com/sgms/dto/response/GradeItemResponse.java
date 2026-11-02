package com.sgms.dto.response;

import java.time.LocalDateTime;

public class GradeItemResponse {
    private Long enrollmentId;
    private Long gradeRecordId;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String studentEmail;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Double credits;
    private Long semesterId;
    private String semesterName;
    private Long academicYearId;
    private String academicYearCode;
    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;
    private Double percentage;
    private String grade;
    private Double gradePoint;
    private boolean draft;
    private boolean published;
    private String remarks;
    private String evaluatedByName;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    public GradeItemResponse() {}

    public Long getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }

    public Long getGradeRecordId() { return gradeRecordId; }
    public void setGradeRecordId(Long gradeRecordId) { this.gradeRecordId = gradeRecordId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Double getCredits() { return credits; }
    public void setCredits(Double credits) { this.credits = credits; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public Long getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }

    public String getAcademicYearCode() { return academicYearCode; }
    public void setAcademicYearCode(String academicYearCode) { this.academicYearCode = academicYearCode; }

    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }

    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Double getGradePoint() { return gradePoint; }
    public void setGradePoint(Double gradePoint) { this.gradePoint = gradePoint; }

    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getEvaluatedByName() { return evaluatedByName; }
    public void setEvaluatedByName(String evaluatedByName) { this.evaluatedByName = evaluatedByName; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}

