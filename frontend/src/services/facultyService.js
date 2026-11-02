import { apiRequest } from './api';

export const facultyService = {
  getAssignedSubjects() {
    return apiRequest('/faculty/subjects');
  },

  getStudentRoster(subjectId, academicYearId) {
    const query = academicYearId ? `?academicYearId=${academicYearId}` : '';
    return apiRequest(`/faculty/subjects/${subjectId}/roster${query}`);
  },

  saveMarks(data) {
    return apiRequest('/faculty/marks/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getSubjectAnalytics(subjectId) {
    return apiRequest(`/faculty/subjects/${subjectId}/analytics`);
  },

  getAcademicYears() {
    return apiRequest('/faculty/academic-years');
  }
};

