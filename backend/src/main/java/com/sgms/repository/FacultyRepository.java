package com.sgms.repository;

import com.sgms.entity.Faculty;
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
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUser(User user);
    Optional<Faculty> findByEmployeeId(String employeeId);
    Optional<Faculty> findByUser_Username(String username);
    boolean existsByEmployeeId(String employeeId);
    List<Faculty> findByDepartment_Id(Long departmentId);

    @Query("SELECT f FROM Faculty f WHERE " +
           "(:departmentId IS NULL OR f.department.id = :departmentId) AND " +
           "(:search IS NULL OR LOWER(f.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.employeeId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.user.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Faculty> searchFaculties(@Param("departmentId") Long departmentId,
                                  @Param("search") String search,
                                  Pageable pageable);
}

