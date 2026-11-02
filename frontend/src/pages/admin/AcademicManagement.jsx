import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Building2, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export const AcademicManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [depts, sems, years] = await Promise.all([
        adminService.getDepartments(),
        adminService.getSemesters(),
        adminService.getAcademicYears()
      ]);
      setDepartments(depts || []);
      setSemesters(sems || []);
      setAcademicYears(years || []);
    } catch {
      toast.error('Failed to load academic setup data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await adminService.createDepartment(deptForm);
      toast.success('Department created successfully');
      setIsDeptModalOpen(false);
      setDeptForm({ code: '', name: '', description: '' });
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create department');
    }
  };

  if (loading) return <LoadingSpinner text="Loading academic structure..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Structure & Configurations</h1>
        <p className="text-sm text-slate-500">Configure academic departments, terms, and institutional calendar years</p>
      </div>

      {/* Departments Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Departments</h2>
              <p className="text-xs text-slate-400">Undergraduate & postgraduate degree programs</p>
            </div>
          </div>
          <button
            onClick={() => setIsDeptModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-indigo-600 text-sm">{d.code}</span>
                <span className="text-[10px] text-slate-400 uppercase">ID #{d.id}</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">{d.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description || 'No description provided'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Semesters & Academic Years */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Semesters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Configured Semesters</h2>
              <p className="text-xs text-slate-400">Grading progression terms (Sem 1 to Sem 8)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {semesters.map((s) => (
              <div key={s.id} className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-mono">Term {s.semesterNumber}</span>
                <span className="font-bold text-slate-800 text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Years */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Sessions</h2>
              <p className="text-xs text-slate-400">Institutional session calendars</p>
            </div>
          </div>

          <div className="space-y-3">
            {academicYears.map((y) => (
              <div key={y.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-sm">{y.yearCode}</span>
                  <p className="text-xs text-slate-400">
                    {y.startDate} to {y.endDate}
                  </p>
                </div>
                {y.current ? (
                  <Badge variant="success">Current Academic Year</Badge>
                ) : (
                  <Badge variant="default">Archived Session</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Department Modal */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title="Add Academic Department"
      >
        <form onSubmit={handleCreateDept} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department Code *</label>
            <input
              type="text"
              required
              value={deptForm.code}
              onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. AI / DS"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence & Data Science"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              placeholder="Brief summary of department programs..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDeptModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

