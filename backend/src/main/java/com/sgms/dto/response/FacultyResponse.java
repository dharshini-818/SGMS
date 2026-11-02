package com.sgms.dto.response;

public class FacultyResponse {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String employeeId;
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String designation;
    private String phone;
    private String qualification;
    private boolean active;
    private int assignedSubjectsCount;

    public FacultyResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getAssignedSubjectsCount() { return assignedSubjectsCount; }
    public void setAssignedSubjectsCount(int assignedSubjectsCount) { this.assignedSubjectsCount = assignedSubjectsCount; }
}

