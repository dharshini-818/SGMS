package com.sgms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "grade_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"enrollment_id"})
})
public class GradeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id", nullable = false, unique = true)
    private Enrollment enrollment;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "50.0")
    private Double internalMarks;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "50.0")
    private Double externalMarks;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double totalMarks;

    private Double percentage;

    @Column(length = 10)
    private String grade; // O, A+, A, B+, B, C, F

    private Double gradePoint; // 10.0, 9.0, ..., 0.0

    @Column(nullable = false)
    private boolean isDraft = true;

    @Column(nullable = false)
    private boolean isPublished = false;

    @Column(length = 255)
    private String remarks;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evaluated_by_id")
    private Faculty evaluatedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    public GradeRecord() {}

    public GradeRecord(Enrollment enrollment, Double internalMarks, Double externalMarks,
                       Double totalMarks, Double percentage, String grade, Double gradePoint,
                       boolean isDraft, boolean isPublished, Faculty evaluatedBy, String remarks) {
        this.enrollment = enrollment;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.grade = grade;
        this.gradePoint = gradePoint;
        this.isDraft = isDraft;
        this.isPublished = isPublished;
        this.evaluatedBy = evaluatedBy;
        this.remarks = remarks;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Enrollment getEnrollment() { return enrollment; }
    public void setEnrollment(Enrollment enrollment) { this.enrollment = enrollment; }

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

    public boolean isDraft() { return isDraft; }
    public void setDraft(boolean draft) { isDraft = draft; }

    public boolean isPublished() { return isPublished; }
    public void setPublished(boolean published) { isPublished = published; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Faculty getEvaluatedBy() { return evaluatedBy; }
    public void setEvaluatedBy(Faculty evaluatedBy) { this.evaluatedBy = evaluatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
