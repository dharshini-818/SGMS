import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReports = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  const loadMeta = async () => {
    try {
      const [stuRes, subRes, semRes] = await Promise.all([
        adminService.getStudents({ size: 100 }),
        adminService.getSubjects({ size: 100 }),
        adminService.getSemesters()
      ]);
      setStudents(stuRes?.content || []);
      setSubjects(subRes?.content || []);
      setSemesters(semRes || []);

      if (stuRes?.content?.length) setSelectedStudentId(stuRes.content[0].id);
      if (semRes?.length) setSelectedSemesterId(semRes[0].id);
      if (subRes?.content?.length) setSelectedSubjectId(subRes.content[0].id);
    } catch {
      toast.error('Failed to load metadata');
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedStudentId || !selectedSemesterId) {
      toast.error('Please select both a student and semester');
      return;
    }
    setDownloadingPdf(true);
    try {
      const student = students.find(s => s.id === parseInt(selectedStudentId));
      const sem = semesters.find(s => s.id === parseInt(selectedSemesterId));
      const filename = `ReportCard_${student?.rollNumber || 'Student'}_Sem${sem?.semesterNumber || 1}.pdf`;

      await reportService.downloadStudentReportPdf(selectedStudentId, selectedSemesterId, filename);
      toast.success('PDF Report Card downloaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to download PDF report card');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    if (!selectedSubjectId) {
      toast.error('Please select a course subject');
      return;
    }
    setDownloadingCsv(true);
    try {
      const sub = subjects.find(s => s.id === parseInt(selectedSubjectId));
      const filename = `Marks_${sub?.code || 'Subject'}.csv`;

      await reportService.exportSubjectMarksCsv(selectedSubjectId, null, filename);
      toast.success('Subject marks exported to CSV successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV');
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Reports & Exports</h1>
        <p className="text-sm text-slate-500">Generate authenticated PDF report cards and export departmental score sheets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PDF Report Card Generator */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Semester Report Card (PDF)</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Official institutional statement of marks with letter grades, credits, SGPA, and cumulative CGPA.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.rollNumber} - {s.fullName} ({s.departmentCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Semester</label>
                <select
                  value={selectedSemesterId}
                  onChange={(e) => setSelectedSemesterId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {semesters.map(sem => (
                    <option key={sem.id} value={sem.id}>{sem.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Report Card'}</span>
            </button>
          </div>
        </div>

        {/* CSV Marks Export */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Subject Marks Export (CSV)</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Export comprehensive marks roster with roll numbers, internal scores, external scores, percentages, and grades.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Course Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.code} - {sub.name} ({sub.departmentCode})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleDownloadCsv}
              disabled={downloadingCsv}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingCsv ? 'Exporting CSV...' : 'Export Marks to CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

