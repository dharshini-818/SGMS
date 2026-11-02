import { apiRequest } from './api';

export const adminService = {
  getDashboardStats() {
    return apiRequest('/admin/dashboard');
  },

  getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/students?${query}`);
  },

  getStudentById(id) {
    return apiRequest(`/admin/students/${id}`);
  },

  createStudent(data) {
    return apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateStudent(id, data) {
    return apiRequest(`/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  toggleStudentStatus(id) {
    return apiRequest(`/admin/students/${id}/status`, {
      method: 'PATCH'
    });
  },

  deleteStudent(id) {
    return apiRequest(`/admin/students/${id}`, {
      method: 'DELETE'
    });
  },

  getFaculties(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/faculties?${query}`);
  },

  createFaculty(data) {
    return apiRequest('/admin/faculties', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateFaculty(id, data) {
    return apiRequest(`/admin/faculties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  toggleFacultyStatus(id) {
    return apiRequest(`/admin/faculties/${id}/status`, {
      method: 'PATCH'
    });
  },

  getSubjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/subjects?${query}`);
  },

  createSubject(data) {
    return apiRequest('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateSubject(id, data) {
    return apiRequest(`/admin/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  assignFaculty(subjectId, facultyId) {
    return apiRequest(`/admin/subjects/${subjectId}/assign-faculty?facultyId=${facultyId || ''}`, {
      method: 'POST'
    });
  },

  getDepartments() {
    return apiRequest('/admin/departments');
  },

  createDepartment(data) {
    return apiRequest('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getSemesters() {
    return apiRequest('/admin/semesters');
  },

  getAcademicYears() {
    return apiRequest('/admin/academic-years');
  },

  getGrades(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/grades?${query}`);
  },

  correctGrade(id, internalMarks, externalMarks, remarks) {
    return apiRequest(`/admin/grades/${id}/correct?internalMarks=${internalMarks}&externalMarks=${externalMarks}&remarks=${encodeURIComponent(remarks || '')}`, {
      method: 'PUT'
    });
  },

  publishResults(data) {
    return apiRequest('/admin/results/publish', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

