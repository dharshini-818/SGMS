package com.sgms.dto.response;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    // Admin stats
    private Long totalStudents;
    private Long totalFaculties;
    private Long totalSubjects;
    private Long totalEnrollments;
    private Long totalDepartments;

    // Faculty stats
    private Integer assignedSubjectsCount;
    private Long pendingMarksCount;
    private Long publishedResultsCount;

    // Charts / Analytics data
    private Map<String, Long> gradeDistribution; // e.g. {"O": 12, "A+": 25, "A": 30, ...}
    private List<Map<String, Object>> subjectPerformance; // [{"subject": "Data Structures", "avgScore": 78.5, "passRate": 92.0}]
    private List<Map<String, Object>> enrollmentTrends; // [{"semester": "Sem 1", "students": 45}]
    private List<Map<String, Object>> recentActivities;

    public DashboardStatsResponse() {}

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalFaculties() { return totalFaculties; }
    public void setTotalFaculties(Long totalFaculties) { this.totalFaculties = totalFaculties; }

    public Long getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(Long totalSubjects) { this.totalSubjects = totalSubjects; }

    public Long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(Long totalEnrollments) { this.totalEnrollments = totalEnrollments; }

    public Long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(Long totalDepartments) { this.totalDepartments = totalDepartments; }

    public Integer getAssignedSubjectsCount() { return assignedSubjectsCount; }
    public void setAssignedSubjectsCount(Integer assignedSubjectsCount) { this.assignedSubjectsCount = assignedSubjectsCount; }

    public Long getPendingMarksCount() { return pendingMarksCount; }
    public void setPendingMarksCount(Long pendingMarksCount) { this.pendingMarksCount = pendingMarksCount; }

    public Long getPublishedResultsCount() { return publishedResultsCount; }
    public void setPublishedResultsCount(Long publishedResultsCount) { this.publishedResultsCount = publishedResultsCount; }

    public Map<String, Long> getGradeDistribution() { return gradeDistribution; }
    public void setGradeDistribution(Map<String, Long> gradeDistribution) { this.gradeDistribution = gradeDistribution; }

    public List<Map<String, Object>> getSubjectPerformance() { return subjectPerformance; }
    public void setSubjectPerformance(List<Map<String, Object>> subjectPerformance) { this.subjectPerformance = subjectPerformance; }

    public List<Map<String, Object>> getEnrollmentTrends() { return enrollmentTrends; }
    public void setEnrollmentTrends(List<Map<String, Object>> enrollmentTrends) { this.enrollmentTrends = enrollmentTrends; }

    public List<Map<String, Object>> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<Map<String, Object>> recentActivities) { this.recentActivities = recentActivities; }
}

