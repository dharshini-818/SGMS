package com.sgms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 30)
    private String code; // e.g. "CS301"

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name; // e.g. "Data Structures and Algorithms"

    @NotNull
    @DecimalMin("0.5")
    @Column(nullable = false)
    private Double credits; // e.g. 4.0 or 3.0

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_faculty_id")
    private Faculty assignedFaculty;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Subject() {}

    public Subject(String code, String name, Double credits, Department department, Semester semester, Faculty assignedFaculty) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.department = department;
        this.semester = semester;
        this.assignedFaculty = assignedFaculty;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCredits() { return credits; }
    public void setCredits(Double credits) { this.credits = credits; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }

    public Faculty getAssignedFaculty() { return assignedFaculty; }
    public void setAssignedFaculty(Faculty assignedFaculty) { this.assignedFaculty = assignedFaculty; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

