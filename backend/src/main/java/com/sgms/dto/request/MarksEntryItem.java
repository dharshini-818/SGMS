package com.sgms.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class MarksEntryItem {
    @NotNull(message = "Enrollment ID is required")
    private Long enrollmentId;

    @DecimalMin(value = "0.0", message = "Internal marks cannot be negative")
    @DecimalMax(value = "50.0", message = "Internal marks cannot exceed 50.0")
    private Double internalMarks;

    @DecimalMin(value = "0.0", message = "External marks cannot be negative")
    @DecimalMax(value = "50.0", message = "External marks cannot exceed 50.0")
    private Double externalMarks;

    private String remarks;

    public MarksEntryItem() {}

    public MarksEntryItem(Long enrollmentId, Double internalMarks, Double externalMarks, String remarks) {
        this.enrollmentId = enrollmentId;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.remarks = remarks;
    }

    public Long getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }

    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }

    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

