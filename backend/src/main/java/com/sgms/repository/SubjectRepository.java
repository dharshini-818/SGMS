package com.sgms.repository;

import com.sgms.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    boolean existsByCode(String code);

    List<Subject> findByAssignedFaculty_Id(Long facultyId);
    List<Subject> findByDepartment_IdAndSemester_Id(Long departmentId, Long semesterId);
    List<Subject> findByDepartment_Id(Long departmentId);
    List<Subject> findBySemester_Id(Long semesterId);

    @Query("SELECT s FROM Subject s WHERE " +
           "(:departmentId IS NULL OR s.department.id = :departmentId) AND " +
           "(:semesterId IS NULL OR s.semester.id = :semesterId) AND " +
           "(:facultyId IS NULL OR s.assignedFaculty.id = :facultyId) AND " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Subject> searchSubjects(@Param("departmentId") Long departmentId,
                                 @Param("semesterId") Long semesterId,
                                 @Param("facultyId") Long facultyId,
                                 @Param("search") String search,
                                 Pageable pageable);
}

