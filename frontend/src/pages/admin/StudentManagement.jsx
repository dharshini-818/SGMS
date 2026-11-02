import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Search, Filter, Edit, Trash2, Power, UserCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    rollNumber: '',
    departmentId: '',
    semesterId: '',
    academicYearId: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [page, departmentId, semesterId, academicYearId]);

  const loadFilterOptions = async () => {
    try {
      const [depts, sems, years] = await Promise.all([
        adminService.getDepartments(),
        adminService.getSemesters(),
        adminService.getAcademicYears()
      ]);
      setDepartments(depts || []);
      setSemesters(sems || []);
      setAcademicYears(years || []);
    } catch (err) {
      toast.error('Failed to load filter options');
    }
  };

  const loadStudents = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        departmentId: 'departmentId' in overrideParams ? overrideParams.departmentId : (departmentId || undefined),
        semesterId: 'semesterId' in overrideParams ? overrideParams.semesterId : (semesterId || undefined),
        academicYearId: 'academicYearId' in overrideParams ? overrideParams.academicYearId : (academicYearId || undefined),
        search: 'search' in overrideParams ? overrideParams.search : (search || undefined),
        page: 'page' in overrideParams ? overrideParams.page : page,
        size: 10
      });
      setStudents(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadStudents();
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      rollNumber: '',
      departmentId: departments[0]?.id ? String(departments[0].id) : '',
      semesterId: semesters[0]?.id ? String(semesters[0].id) : '',
      academicYearId: (academicYears.find(y => y.current)?.id || academicYears[0]?.id) ? String(academicYears.find(y => y.current)?.id || academicYears[0]?.id) : '',
      phone: '',
      address: '',
      dateOfBirth: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (stu) => {
    setEditingStudent(stu);
    setFormData({
      username: stu.username,
      email: stu.email,
      password: '',
      fullName: stu.fullName,
      rollNumber: stu.rollNumber,
      departmentId: stu.departmentId ? String(stu.departmentId) : '',
      semesterId: stu.semesterId ? String(stu.semesterId) : '',
      academicYearId: stu.academicYearId ? String(stu.academicYearId) : '',
      phone: stu.phone || '',
      address: stu.address || '',
      dateOfBirth: stu.dateOfBirth || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.departmentId) {
        toast.error('Please select a department');
        return;
      }
      if (!formData.semesterId) {
        toast.error('Please select a semester');
        return;
      }
      if (!formData.academicYearId) {
        toast.error('Please select an academic year');
        return;
      }

      if (editingStudent) {
        await adminService.updateStudent(editingStudent.id, formData);
        toast.success('Student updated successfully');
      } else {
        await adminService.createStudent(formData);
        toast.success('Student created and auto-enrolled in subjects');
      }
      setIsModalOpen(false);
      setSearch('');
      setDepartmentId('');
      setSemesterId('');
      setAcademicYearId('');
      setPage(0);
      await loadStudents({ departmentId: undefined, semesterId: undefined, academicYearId: undefined, search: undefined, page: 0 });
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleStudentStatus(id);
      toast.success('Student account status updated');
      loadStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteStudent(id);
      toast.success('Student deleted successfully');
      setDeleteConfirmId(null);
      loadStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-sm text-slate-500">Manage student admissions, profiles, and departmental enrollments</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
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

          <select
            value={academicYearId}
            onChange={(e) => { setAcademicYearId(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Academic Years</option>
            {academicYears.map(y => (
              <option key={y.id} value={y.id}>{y.yearCode} {y.current ? '(Current)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading students..." />
        ) : students.length === 0 ? (
          <div className="text-center py-16 px-4">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No students found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting search parameters or register a new student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Roll Number</th>
                  <th className="py-4 px-6">Full Name</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Academic Year</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {stu.rollNumber}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div>{stu.fullName}</div>
                      <div className="text-xs text-slate-400 font-normal">{stu.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">{stu.departmentCode}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="primary">{stu.semesterName}</Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                      {stu.academicYearCode}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={stu.active ? 'success' : 'danger'}>
                        {stu.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(stu)}
                        title="Edit Student"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(stu.id)}
                        title={stu.active ? 'Deactivate Account' : 'Activate Account'}
                        className={`p-1.5 rounded-lg transition ${
                          stu.active
                            ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
                            : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(stu.id)}
                        title="Delete Student"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.rollNumber}` : 'Register New Student'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Roll Number *</label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. CS2024005"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Username *</label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. john.doe"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {editingStudent ? 'Reset Password (optional)' : 'Password (optional - default Student@roll)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 University Road, City"
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
                <option value="">Select Department</option>
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
                <option value="">Select Semester</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Academic Year *</label>
              <select
                required
                value={formData.academicYearId}
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map(y => (
                  <option key={y.id} value={y.id}>{y.yearCode} {y.current ? '(Current)' : ''}</option>
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20"
            >
              {editingStudent ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Student Deletion"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 text-rose-800 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>Warning: Deleting this student will remove their enrollments and grade records permanently.</p>
            </div>
            <p className="text-sm text-slate-600">Are you sure you want to proceed with deletion?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold"
              >
                Delete Student
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

