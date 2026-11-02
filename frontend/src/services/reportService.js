import { apiRequest } from './api';

export const reportService = {
  async downloadStudentReportPdf(studentId, semesterId, filename = 'ReportCard.pdf') {
    const blob = await apiRequest(`/reports/student/${studentId}/semester/${semesterId}/pdf`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async exportSubjectMarksCsv(subjectId, academicYearId, filename = 'SubjectMarks.csv') {
    const query = academicYearId ? `?academicYearId=${academicYearId}` : '';
    const blob = await apiRequest(`/reports/subject/${subjectId}/csv${query}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

