import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { reportService } from '../../services/reportService';
import { GradeBadge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Award, Download, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentResults = () => {
  const [profile, setProfile] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [result, setResult] = useState(null);
  const [cumulative, setCumulative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedSemesterId) {
      loadSemesterResult();
    }
  }, [selectedSemesterId]);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [prof, sems, cum] = await Promise.all([
        studentService.getProfile(),
        studentService.getSemesters(),
        studentService.getCumulativeResult()
      ]);
      setProfile(prof);
      setSemesters(sems || []);
      setCumulative(cum);

      const targetSem = (sems || []).find(s => s.id === prof?.semesterId) || sems[0];
      if (targetSem) {
        setSelectedSemesterId(targetSem.id.toString());
      }
    } catch {
      toast.error('Failed to load student academic records');
    } finally {
      setLoading(false);
    }
  };

  const loadSemesterResult = async () => {
    try {
      const data = await studentService.getSemesterResult(selectedSemesterId);
      setResult(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load semester results');
    }
  };

  const handleDownloadPdf = async () => {
    if (!profile || !result) return;
    setDownloading(true);
    try {
      const filename = `Official_ReportCard_${profile.rollNumber}_Sem${result.semesterNumber}.pdf`;
      await reportService.downloadStudentReportPdf(profile.id, result.semesterId, filename);
      toast.success('Official PDF Report Card downloaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to download report card');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading academic statements..." />;

  const isPublished = result?.fullyPublished;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Results & Statement of Marks</h1>
          <p className="text-sm text-slate-500">Official semester scorecards, credit weightings, and letter grades</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {isPublished && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Credits</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{result?.totalCredits || 0}</h3>
          <p className="text-xs text-slate-400 mt-1">Applicable course credits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Earned Credits</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{result?.earnedCredits || 0}</h3>
          <p className="text-xs text-slate-400 mt-1">Passing credits acquired</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Semester GPA (SGPA)</span>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">
            {result?.sgpa != null ? result.sgpa.toFixed(2) : 'N/A'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">10.0 grade scale</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Term Status</span>
          <div className="mt-1 flex items-center gap-2">
            {result?.resultStatus === 'PASSED' ? (
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-emerald-600">
                <CheckCircle2 className="w-5 h-5" /> PASSED
              </span>
            ) : result?.resultStatus === 'FAILED' ? (
              <span className="inline-flex items-center gap-1.5 text-base font-bold text-rose-600">
                <XCircle className="w-5 h-5" /> FAILED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600">
                <Clock className="w-4 h-4" /> Pending Publication
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Official publication</p>
        </div>
      </div>

      {/* Result Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!result?.subjects || result.subjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No subjects registered for this semester.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Subject Code</th>
                  <th className="py-4 px-6">Subject Name</th>
                  <th className="py-4 px-4 text-center">Credits</th>
                  <th className="py-4 px-4 text-center">Internal (50)</th>
                  <th className="py-4 px-4 text-center">External (50)</th>
                  <th className="py-4 px-4 text-center">Total (100)</th>
                  <th className="py-4 px-4 text-center">Percentage</th>
                  <th className="py-4 px-4 text-center">Grade</th>
                  <th className="py-4 px-4 text-center">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.subjects.map((sub) => (
                  <tr key={sub.enrollmentId} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {sub.subjectCode}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {sub.subjectName}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {sub.credits}
                    </td>
                    {sub.published ? (
                      <>
                        <td className="py-4 px-4 text-center font-mono">{sub.internalMarks}</td>
                        <td className="py-4 px-4 text-center font-mono">{sub.externalMarks}</td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">{sub.totalMarks}</td>
                        <td className="py-4 px-4 text-center font-mono">{sub.percentage}%</td>
                        <td className="py-4 px-4 text-center">
                          <GradeBadge grade={sub.grade} />
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-semibold text-slate-800">
                          {sub.gradePoint}
                        </td>
                      </>
                    ) : (
                      <td colSpan={6} className="py-4 px-4 text-center text-xs italic text-amber-600 bg-amber-50/40">
                        Result Pending Publication by Administration
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cumulative Performance Card */}
      {cumulative?.cgpa != null && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-indigo-950 text-base">Overall Cumulative Performance (CGPA)</h4>
            <p className="text-xs text-indigo-700 mt-1">
              Calculated across all officially completed and published terms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-indigo-700">{cumulative.cgpa.toFixed(2)}</span>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">/ 10.0 CGPA</span>
          </div>
        </div>
      )}
    </div>
  );
};

