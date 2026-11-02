package com.sgms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "semesters")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(1)
    @Max(12)
    @Column(unique = true, nullable = false)
    private Integer semesterNumber;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String name;

    public Semester() {}

    public Semester(Integer semesterNumber, String name) {
        this.semesterNumber = semesterNumber;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(Integer semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

