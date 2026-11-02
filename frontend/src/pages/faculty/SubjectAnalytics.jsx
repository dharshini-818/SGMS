import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { facultyService } from '../../services/facultyService';
import { StatCard } from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const SubjectAnalytics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || '');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      loadAnalytics();
    }
  }, [selectedSubjectId]);

  const loadSubjects = async () => {
    try {
      const subs = await facultyService.getAssignedSubjects();
      setSubjects(subs || []);
      if (!selectedSubjectId && subs?.length > 0) {
        setSelectedSubjectId(subs[0].id.toString());
      }
    } catch {
      toast.error('Failed to load assigned subjects');
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getSubjectAnalytics(selectedSubjectId);
      setAnalytics(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load subject analytics');
    } finally {
      setLoading(false);
    }
  };

  const chartData = analytics?.gradeDistribution
    ? Object.entries(analytics.gradeDistribution).map(([grade, count]) => ({
        grade,
        count
      }))
    : [];

  const GRADE_COLORS = {
    'O': '#7C3AED',
    'A+': '#10B981',
    'A': '#4F46E5',
    'B+': '#3B82F6',
    'B': '#F59E0B',
    'C': '#6366F1',
    'F': '#EF4444'
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subject Performance Analytics</h1>
          <p className="text-sm text-slate-500">Analyze score distribution, pass ratios, and learning attainment</p>
        </div>

        <div>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSearchParams({ subjectId: e.target.value });
            }}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-sm"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Analyzing student results..." />
      ) : !analytics ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          Select a subject to view performance metrics.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <StatCard
              title="Students Enrolled"
              value={analytics.totalEnrolled || 0}
              icon={Users}
              color="indigo"
              subtitle="Registered students"
            />
            <StatCard
              title="Assessments Graded"
              value={analytics.totalGraded || 0}
              icon={CheckCircle2}
              color="purple"
              subtitle="Completed evaluations"
            />
            <StatCard
              title="Average Score"
              value={`${analytics.averageMarks || 0} / 100`}
              icon={TrendingUp}
              color="blue"
              subtitle="Class mean performance"
            />
            <StatCard
              title="Pass Rate"
              value={`${analytics.passRate || 0}%`}
              icon={BarChart3}
              color="teal"
              subtitle="Students scoring ≥ 40%"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Grade Distribution</h3>
            <p className="text-xs text-slate-500 mb-6">Distribution of letter grades awarded in {analytics.subjectCode}</p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="grade" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  />
                  <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade] || '#4F46E5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

