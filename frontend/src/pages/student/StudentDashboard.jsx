import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { reportService } from '../../services/reportService';
import { StatCard } from '../../components/StatCard';
import { Badge, GradeBadge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { GraduationCap, Award, BookOpen, Download, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [cumulative, setCumulative] = useState(null);
  const [latestSemesterResult, setLatestSemesterResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [prof, cum] = await Promise.all([
        studentService.getProfile(),
        studentService.getCumulativeResult()
      ]);
      setProfile(prof);
      setCumulative(cum);

      // Latest semester result
      if (prof?.semesterId) {
        const semRes = await studentService.getSemesterResult(prof.semesterId);
        setLatestSemesterResult(semRes);
      }
    } catch (err) {
      toast.error('Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!profile || !latestSemesterResult) return;
    setDownloading(true);
    try {
      const filename = `ReportCard_${profile.rollNumber}_Sem${latestSemesterResult.semesterNumber}.pdf`;
      await reportService.downloadStudentReportPdf(profile.id, latestSemesterResult.semesterId, filename);
      toast.success('Report card downloaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to download report card');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading academic records..." />;

  const currentSgpa = latestSemesterResult?.sgpa;
  const overallCgpa = cumulative?.cgpa;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 mb-3 backdrop-blur-sm">
            Student Academic Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.fullName}!
          </h1>
          <p className="mt-1 text-sm text-indigo-100 font-mono">
            Roll Number: {profile?.rollNumber} • {profile?.departmentName}
          </p>
        </div>

        {latestSemesterResult?.fullyPublished && (
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-indigo-50 disabled:opacity-50 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing...' : 'Download Grade Card (PDF)'}</span>
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Term"
          value={profile?.semesterName || 'Semester 1'}
          icon={GraduationCap}
          color="indigo"
          subtitle={profile?.academicYearCode}
        />
        <StatCard
          title="Enrolled Subjects"
          value={latestSemesterResult?.subjects?.length || 0}
          icon={BookOpen}
          color="purple"
          subtitle="Registered this semester"
        />
        <StatCard
          title="Latest Semester GPA"
          value={currentSgpa != null ? `${currentSgpa.toFixed(2)}` : 'Pending'}
          icon={Award}
          color="blue"
          subtitle="SGPA (10.0 scale)"
        />
        <StatCard
          title="Cumulative CGPA"
          value={overallCgpa != null ? `${overallCgpa.toFixed(2)}` : 'Pending'}
          icon={Sparkles}
          color="teal"
          subtitle="Across published terms"
        />
      </div>

      {/* Current Semester Subjects Overview */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {profile?.semesterName} Subjects & Results
            </h2>
            <p className="text-xs text-slate-500">Official grades and examination evaluations</p>
          </div>
          <Link
            to="/student/results"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View Detailed Statement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!latestSemesterResult?.subjects || latestSemesterResult.subjects.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No enrolled subjects recorded for this semester.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4 text-center">Internal (50)</th>
                  <th className="py-3 px-4 text-center">External (50)</th>
                  <th className="py-3 px-4 text-center">Total (100)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestSemesterResult.subjects.map((sub) => (
                  <tr key={sub.enrollmentId} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {sub.subjectCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {sub.subjectName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{sub.credits}</span>
                    </td>
                    {sub.published ? (
                      <>
                        <td className="py-3.5 px-4 text-center font-mono">{sub.internalMarks}</td>
                        <td className="py-3.5 px-4 text-center font-mono">{sub.externalMarks}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{sub.totalMarks}</td>
                        <td className="py-3.5 px-4 text-center">
                          <GradeBadge grade={sub.grade} />
                        </td>
                      </>
                    ) : (
                      <td colSpan={4} className="py-3.5 px-4 text-center text-xs italic text-slate-400">
                        Result Pending Publication
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

