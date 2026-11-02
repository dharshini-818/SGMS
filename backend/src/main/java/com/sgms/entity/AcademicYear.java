package com.sgms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "academic_years")
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 20)
    private String yearCode; // e.g. "2024-2025"

    @Column(nullable = false)
    private boolean isCurrent = false;

    private LocalDate startDate;
    private LocalDate endDate;

    public AcademicYear() {}

    public AcademicYear(String yearCode, boolean isCurrent, LocalDate startDate, LocalDate endDate) {
        this.yearCode = yearCode;
        this.isCurrent = isCurrent;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getYearCode() { return yearCode; }
    public void setYearCode(String yearCode) { this.yearCode = yearCode; }

    public boolean isCurrent() { return isCurrent; }
    public void setCurrent(boolean current) { isCurrent = current; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}

