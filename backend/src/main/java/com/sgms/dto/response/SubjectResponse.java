package com.sgms.dto.response;

public class SubjectResponse {
    private Long id;
    private String code;
    private String name;
    private Double credits;
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private Long semesterId;
    private Integer semesterNumber;
    private String semesterName;
    private Long assignedFacultyId;
    private String assignedFacultyName;
    private String assignedFacultyEmployeeId;
    private boolean active;
    private long enrolledStudentsCount;

    public SubjectResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCredits() { return credits; }
    public void setCredits(Double credits) { this.credits = credits; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public Integer getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(Integer semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public Long getAssignedFacultyId() { return assignedFacultyId; }
    public void setAssignedFacultyId(Long assignedFacultyId) { this.assignedFacultyId = assignedFacultyId; }

    public String getAssignedFacultyName() { return assignedFacultyName; }
    public void setAssignedFacultyName(String assignedFacultyName) { this.assignedFacultyName = assignedFacultyName; }

    public String getAssignedFacultyEmployeeId() { return assignedFacultyEmployeeId; }
    public void setAssignedFacultyEmployeeId(String assignedFacultyEmployeeId) { this.assignedFacultyEmployeeId = assignedFacultyEmployeeId; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getEnrolledStudentsCount() { return enrolledStudentsCount; }
    public void setEnrolledStudentsCount(long enrolledStudentsCount) { this.enrolledStudentsCount = enrolledStudentsCount; }
}

