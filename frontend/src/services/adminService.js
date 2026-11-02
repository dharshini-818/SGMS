import { apiRequest, toQueryString } from './api';

export const adminService = {
  getDashboardStats() {
    return apiRequest('/admin/dashboard');
  },

  getStudents(params = {}) {
    return apiRequest(`/admin/students${toQueryString(params)}`);
  },

  getStudentById(id) {
    return apiRequest(`/admin/students/${id}`);
  },

  createStudent(data) {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim(),
      fullName: data.fullName?.trim(),
      rollNumber: data.rollNumber?.trim(),
      departmentId: Number(data.departmentId),
      semesterId: Number(data.semesterId),
      academicYearId: Number(data.academicYearId),
    };
    if (data.password && data.password.trim()) payload.password = data.password.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
    if (data.address && data.address.trim()) payload.address = data.address.trim();
    if (data.dateOfBirth && data.dateOfBirth.trim()) payload.dateOfBirth = data.dateOfBirth.trim();

    return apiRequest('/admin/students', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateStudent(id, data) {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim(),
      fullName: data.fullName?.trim(),
      rollNumber: data.rollNumber?.trim(),
      departmentId: Number(data.departmentId),
      semesterId: Number(data.semesterId),
      academicYearId: Number(data.academicYearId),
    };
    if (data.password && data.password.trim()) payload.password = data.password.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
    if (data.address && data.address.trim()) payload.address = data.address.trim();
    if (data.dateOfBirth && data.dateOfBirth.trim()) payload.dateOfBirth = data.dateOfBirth.trim();

    return apiRequest(`/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
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
    return apiRequest(`/admin/faculties${toQueryString(params)}`);
  },

  createFaculty(data) {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim(),
      fullName: data.fullName?.trim(),
      employeeId: data.employeeId?.trim(),
      departmentId: Number(data.departmentId),
    };
    if (data.password && data.password.trim()) payload.password = data.password.trim();
    if (data.designation && data.designation.trim()) payload.designation = data.designation.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
    if (data.qualification && data.qualification.trim()) payload.qualification = data.qualification.trim();

    return apiRequest('/admin/faculties', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateFaculty(id, data) {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim(),
      fullName: data.fullName?.trim(),
      employeeId: data.employeeId?.trim(),
      departmentId: Number(data.departmentId),
    };
    if (data.password && data.password.trim()) payload.password = data.password.trim();
    if (data.designation && data.designation.trim()) payload.designation = data.designation.trim();
    if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
    if (data.qualification && data.qualification.trim()) payload.qualification = data.qualification.trim();

    return apiRequest(`/admin/faculties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  toggleFacultyStatus(id) {
    return apiRequest(`/admin/faculties/${id}/status`, {
      method: 'PATCH'
    });
  },

  getSubjects(params = {}) {
    return apiRequest(`/admin/subjects${toQueryString(params)}`);
  },

  createSubject(data) {
    const payload = {
      code: data.code?.trim(),
      name: data.name?.trim(),
      credits: Number(data.credits),
      departmentId: Number(data.departmentId),
      semesterId: Number(data.semesterId),
    };
    const facId = data.assignedFacultyId || data.facultyId;
    if (facId) payload.assignedFacultyId = Number(facId);

    return apiRequest('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateSubject(id, data) {
    const payload = {
      code: data.code?.trim(),
      name: data.name?.trim(),
      credits: Number(data.credits),
      departmentId: Number(data.departmentId),
      semesterId: Number(data.semesterId),
    };
    const facId = data.assignedFacultyId || data.facultyId;
    if (facId) payload.assignedFacultyId = Number(facId);

    return apiRequest(`/admin/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
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
    return apiRequest(`/admin/grades${toQueryString(params)}`);
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
