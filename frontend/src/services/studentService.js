import { apiRequest } from './api';

export const studentService = {
  getProfile() {
    return apiRequest('/student/profile');
  },

  getSemesters() {
    return apiRequest('/student/semesters');
  },

  getSemesterResult(semesterId) {
    return apiRequest(`/student/results/${semesterId}`);
  },

  getCumulativeResult() {
    return apiRequest('/student/results/cumulative');
  }
};

