package com.sgms.repository;

import com.sgms.entity.Student;
import com.sgms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUser_Username(String username);
    boolean existsByRollNumber(String rollNumber);

    List<Student> findByDepartment_Id(Long departmentId);
    List<Student> findByCurrentSemester_Id(Long semesterId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:departmentId IS NULL OR s.department.id = :departmentId) AND " +
           "(:semesterId IS NULL OR s.currentSemester.id = :semesterId) AND " +
           "(:academicYearId IS NULL OR s.academicYear.id = :academicYearId) AND " +
           "(:search IS NULL OR LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("departmentId") Long departmentId,
                                 @Param("semesterId") Long semesterId,
                                 @Param("academicYearId") Long academicYearId,
                                 @Param("search") String search,
                                 Pageable pageable);
}

