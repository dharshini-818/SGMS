package com.sgms.dto.request;

import jakarta.validation.constraints.NotNull;

public class ResultPublishRequest {
    @NotNull(message = "Academic year ID is required")
    private Long academicYearId;

    @NotNull(message = "Semester ID is required")
    private Long semesterId;

    private Long subjectId; // Optional: null to publish entire semester

    private boolean publish = true; // true to publish, false to unpublish

    public ResultPublishRequest() {}

    public Long getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public boolean isPublish() { return publish; }
    public void setPublish(boolean publish) { this.publish = publish; }
}

