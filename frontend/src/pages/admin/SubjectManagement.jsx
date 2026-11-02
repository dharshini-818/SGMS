import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Search, Edit, UserPlus, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetSubject, setTargetSubject] = useState(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 4.0,
    departmentId: '',
    semesterId: '',
    assignedFacultyId: ''
  });

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [page, departmentId, semesterId]);

  const loadMeta = async () => {
    try {
      const [depts, sems, facs] = await Promise.all([
        adminService.getDepartments(),
        adminService.getSemesters(),
        adminService.getFaculties({ size: 100 })
      ]);
      setDepartments(depts || []);
      setSemesters(sems || []);
      setFaculties(facs?.content || []);
    } catch {
      toast.error('Failed to load metadata');
    }
  };

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubjects({
        departmentId: departmentId || undefined,
        semesterId: semesterId || undefined,
        search: search || undefined,
        page,
        size: 10
      });
      setSubjects(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadSubjects();
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setFormData({
      code: '',
      name: '',
      credits: 4.0,
      departmentId: departments[0]?.id || '',
      semesterId: semesters[0]?.id || '',
      assignedFacultyId: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubject(sub);
    setFormData({
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      departmentId: sub.departmentId,
      semesterId: sub.semesterId,
      assignedFacultyId: sub.assignedFacultyId || ''
    });
    setIsModalOpen(true);
  };

  const openAssignModal = (sub) => {
    setTargetSubject(sub);
    setSelectedFacultyId(sub.assignedFacultyId || '');
    setIsAssignModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        credits: parseFloat(formData.credits),
        assignedFacultyId: formData.assignedFacultyId ? parseInt(formData.assignedFacultyId) : null
      };

      if (editingSubject) {
        await adminService.updateSubject(editingSubject.id, payload);
        toast.success('Subject updated successfully');
      } else {
        await adminService.createSubject(payload);
        toast.success('Subject created and students auto-enrolled');
      }
      setIsModalOpen(false);
      loadSubjects();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleAssignFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.assignFaculty(targetSubject.id, selectedFacultyId ? parseInt(selectedFacultyId) : null);
      toast.success('Faculty assigned to subject');
      setIsAssignModalOpen(false);
      loadSubjects();
    } catch (err) {
      toast.error(err.message || 'Failed to assign faculty');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subject Management</h1>
          <p className="text-sm text-slate-500">Configure academic subjects, credit allocations, and faculty assignments</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Subject</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or subject name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={departmentId}
            onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
            ))}
          </select>

          <select
            value={semesterId}
            onChange={(e) => { setSemesterId(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading course subjects..." />
        ) : subjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No subjects found</h3>
            <p className="text-xs text-slate-400 mt-1">Create course subjects to start enrolling students.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Subject Code</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Credits</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Assigned Faculty</th>
                  <th className="py-4 px-6">Enrolled</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {sub.code}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {sub.credits} Credits
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {sub.departmentCode}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="primary">{sub.semesterName}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      {sub.assignedFacultyName ? (
                        <div>
                          <div className="font-semibold text-slate-900">{sub.assignedFacultyName}</div>
                          <div className="text-xs text-slate-400 font-mono">{sub.assignedFacultyEmployeeId}</div>
                        </div>
                      ) : (
                        <span className="text-xs italic text-rose-500 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        {sub.enrolledStudentsCount} Students
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openAssignModal(sub)}
                        title="Assign / Reassign Faculty"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(sub)}
                        title="Edit Subject"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? `Edit Subject: ${editingSubject.code}` : 'Create Course Subject'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject Code *</label>
              <input
                type="text"
                required
                disabled={!!editingSubject}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS305"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Credits (0.5 to 10) *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                required
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Artificial Intelligence & Machine Learning"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Semester *</label>
              <select
                required
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assign Faculty Member</label>
              <select
                value={formData.assignedFacultyId}
                onChange={(e) => setFormData({ ...formData, assignedFacultyId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Leave Unassigned --</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.fullName} ({f.employeeId}) - {f.departmentCode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20"
            >
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Faculty Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Teacher: ${targetSubject?.code} - ${targetSubject?.name}`}
      >
        <form onSubmit={handleAssignFacultySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Faculty Member</label>
            <select
              value={selectedFacultyId}
              onChange={(e) => setSelectedFacultyId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Unassigned --</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.fullName} ({f.employeeId}) - {f.departmentCode}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/20"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

