package com.sgms.repository;

import com.sgms.entity.ResultPublication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultPublicationRepository extends JpaRepository<ResultPublication, Long> {
    Optional<ResultPublication> findByAcademicYear_IdAndSemester_IdAndSubject_Id(
        Long academicYearId, Long semesterId, Long subjectId);

    List<ResultPublication> findByAcademicYear_IdAndSemester_Id(Long academicYearId, Long semesterId);

    boolean existsByAcademicYear_IdAndSemester_IdAndSubject_IdAndPublishedTrue(
        Long academicYearId, Long semesterId, Long subjectId);
}

