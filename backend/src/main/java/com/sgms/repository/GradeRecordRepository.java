package com.sgms.repository;

import com.sgms.entity.GradeRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRecordRepository extends JpaRepository<GradeRecord, Long> {
    Optional<GradeRecord> findByEnrollment_Id(Long enrollmentId);

    List<GradeRecord> findByEnrollment_Student_Id(Long studentId);
    List<GradeRecord> findByEnrollment_Student_IdAndEnrollment_Semester_Id(Long studentId, Long semesterId);
    List<GradeRecord> findByEnrollment_Student_IdAndIsPublishedTrue(Long studentId);
    List<GradeRecord> findByEnrollment_Student_IdAndEnrollment_Semester_IdAndIsPublishedTrue(Long studentId, Long semesterId);

    List<GradeRecord> findByEnrollment_Subject_Id(Long subjectId);
    List<GradeRecord> findByEnrollment_Subject_IdAndEnrollment_AcademicYear_Id(Long subjectId, Long academicYearId);

    long countByEnrollment_Subject_IdAndIsDraftFalse(Long subjectId);
    long countByEnrollment_Subject_IdAndIsPublishedTrue(Long subjectId);

    @Query("SELECT g FROM GradeRecord g WHERE " +
           "(:subjectId IS NULL OR g.enrollment.subject.id = :subjectId) AND " +
           "(:semesterId IS NULL OR g.enrollment.semester.id = :semesterId) AND " +
           "(:academicYearId IS NULL OR g.enrollment.academicYear.id = :academicYearId) AND " +
           "(:isPublished IS NULL OR g.isPublished = :isPublished) AND " +
           "(:search IS NULL OR LOWER(g.enrollment.student.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(g.enrollment.student.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<GradeRecord> searchGrades(@Param("subjectId") Long subjectId,
                                   @Param("semesterId") Long semesterId,
                                   @Param("academicYearId") Long academicYearId,
                                   @Param("isPublished") Boolean isPublished,
                                   @Param("search") String search,
                                   Pageable pageable);
}

