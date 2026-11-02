import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { StatCard } from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BookOpen, Users, Award, CheckCircle2, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const subs = await facultyService.getAssignedSubjects();
      setSubjects(subs || []);
    } catch (err) {
      setError(err.message || 'Failed to load faculty portal');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading faculty workspace..." />;

  const totalEnrolled = subjects.reduce((sum, s) => sum + (s.enrolledStudentsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-purple-100 mb-3 backdrop-blur-sm">
            Faculty Teaching Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Assessment & Grade Management
          </h1>
          <p className="mt-2 text-sm sm:text-base text-purple-100 leading-relaxed">
            Record continuous internal assessments, evaluate final semester examinations, monitor student performance metrics, and submit verified grades.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Subjects"
          value={subjects.length}
          icon={BookOpen}
          color="purple"
          subtitle="Courses in active curriculum"
        />
        <StatCard
          title="Total Students Taught"
          value={totalEnrolled}
          icon={Users}
          color="indigo"
          subtitle="Across assigned subject rosters"
        />
        <StatCard
          title="Grading Status"
          value="Active"
          icon={Award}
          color="teal"
          subtitle="Submissions open"
        />
      </div>

      {/* Assigned Subjects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Assigned Course Subjects</h2>
            <p className="text-xs text-slate-500">Select a course to record marks or review performance metrics</p>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No subjects currently assigned</h3>
            <p className="text-xs text-slate-400 mt-1">Please contact the department administrator to have course subjects allocated to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {sub.semesterName}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{sub.departmentName}</p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Credits</span>
                      <span className="font-bold text-slate-800">{sub.credits}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Roster Size</span>
                      <span className="font-bold text-slate-800">{sub.enrolledStudentsCount} Students</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/faculty/marks?subjectId=${sub.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Enter Marks
                  </Link>
                  <Link
                    to={`/faculty/analytics?subjectId=${sub.id}`}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    title="View Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

