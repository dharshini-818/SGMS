import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Users, UserCheck, BookOpen, Layers, Award, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading administrator dashboard..." />;

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="font-bold">Error loading dashboard</h4>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Transform grade distribution for Recharts
  const gradeChartData = stats?.gradeDistribution
    ? Object.entries(stats.gradeDistribution).map(([grade, count]) => ({
        grade,
        students: count
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
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 mb-3 backdrop-blur-sm">
            Institutional Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Performance & Registry Overview
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
            Manage institutional records, oversee faculty mark submissions, review grade distributions, and authorize official publication of semester results.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="indigo"
          subtitle="Registered in departments"
        />
        <StatCard
          title="Total Faculty"
          value={stats?.totalFaculties || 0}
          icon={UserCheck}
          color="purple"
          subtitle="Teaching staff members"
        />
        <StatCard
          title="Course Subjects"
          value={stats?.totalSubjects || 0}
          icon={BookOpen}
          color="blue"
          subtitle="Across all semesters"
        />
        <StatCard
          title="Total Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={Layers}
          color="teal"
          subtitle="Active course enrollments"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Institution-Wide Grade Distribution</h3>
              <p className="text-xs text-slate-500">Student letter grades across all recorded subjects</p>
            </div>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="grade" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {gradeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade] || '#4F46E5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Academic Performance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Subject Performance Metrics</h3>
              <p className="text-xs text-slate-500">Average score & student pass rates</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.subjectPerformance || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="subjectCode" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                />
                <Bar dataKey="avgScore" name="Avg Score (%)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Quick Administrative Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/students"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Register New Student</h4>
                  <p className="text-xs text-slate-500">Add profile & auto-enroll</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/admin/faculty"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Manage Faculty Accounts</h4>
                  <p className="text-xs text-slate-500">Assign subjects & departments</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/admin/publish"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Publish Semester Results</h4>
                  <p className="text-xs text-slate-500">Make grades visible to students</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Audit Activities</h3>
              <p className="text-xs text-slate-500">Live operational & marks modification log</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wider">{act.action}</span>
                    <span className="text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600">{act.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">By: {act.performedBy}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No recent audit logs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

