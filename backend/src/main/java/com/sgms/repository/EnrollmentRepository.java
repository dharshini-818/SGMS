package com.sgms.repository;

import com.sgms.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudent_IdAndSubject_IdAndSemester_IdAndAcademicYear_Id(
        Long studentId, Long subjectId, Long semesterId, Long academicYearId);

    List<Enrollment> findByStudent_Id(Long studentId);
    List<Enrollment> findByStudent_IdAndSemester_Id(Long studentId, Long semesterId);
    List<Enrollment> findBySubject_Id(Long subjectId);
    List<Enrollment> findBySubject_IdAndAcademicYear_Id(Long subjectId, Long academicYearId);

    long countBySubject_Id(Long subjectId);

    @Query("SELECT e FROM Enrollment e WHERE " +
           "(:subjectId IS NULL OR e.subject.id = :subjectId) AND " +
           "(:semesterId IS NULL OR e.semester.id = :semesterId) AND " +
           "(:academicYearId IS NULL OR e.academicYear.id = :academicYearId) AND " +
           "(:search IS NULL OR LOWER(e.student.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.student.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Enrollment> searchEnrollments(@Param("subjectId") Long subjectId,
                                       @Param("semesterId") Long semesterId,
                                       @Param("academicYearId") Long academicYearId,
                                       @Param("search") String search,
                                       Pageable pageable);
}

