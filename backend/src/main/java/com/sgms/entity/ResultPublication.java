package com.sgms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "result_publications")
public class ResultPublication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id")
    private Subject subject; // null means whole semester is published

    @Column(nullable = false)
    private boolean published = true;

    @Column(nullable = false)
    private LocalDateTime publishedAt = LocalDateTime.now();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "published_by_user_id", nullable = false)
    private User publishedBy;

    public ResultPublication() {}

    public ResultPublication(AcademicYear academicYear, Semester semester, Subject subject, boolean published, User publishedBy) {
        this.academicYear = academicYear;
        this.semester = semester;
        this.subject = subject;
        this.published = published;
        this.publishedBy = publishedBy;
        this.publishedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }

    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public User getPublishedBy() { return publishedBy; }
    public void setPublishedBy(User publishedBy) { this.publishedBy = publishedBy; }
}

