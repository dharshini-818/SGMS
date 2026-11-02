package com.sgms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubjectCreateRequest {
    @NotBlank(message = "Subject code is required")
    private String code;

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotNull(message = "Credits are required")
    @DecimalMin(value = "0.5", message = "Credits must be at least 0.5")
    private Double credits;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Semester is required")
    private Long semesterId;

    private Long assignedFacultyId; // nullable

    public SubjectCreateRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCredits() { return credits; }
    public void setCredits(Double credits) { this.credits = credits; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public Long getAssignedFacultyId() { return assignedFacultyId; }
    public void setAssignedFacultyId(Long assignedFacultyId) { this.assignedFacultyId = assignedFacultyId; }
}

