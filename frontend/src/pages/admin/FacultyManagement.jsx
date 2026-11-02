import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Search, Edit, Power, UserCheck, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    employeeId: '',
    departmentId: '',
    designation: '',
    phone: '',
    qualification: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadFaculties();
  }, [page, departmentId]);

  const loadDepartments = async () => {
    try {
      const depts = await adminService.getDepartments();
      setDepartments(depts || []);
    } catch {
      toast.error('Failed to load departments');
    }
  };

  const loadFaculties = async () => {
    try {
      setLoading(true);
      const res = await adminService.getFaculties({
        departmentId: departmentId || undefined,
        search: search || undefined,
        page,
        size: 10
      });
      setFaculties(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadFaculties();
  };

  const openAddModal = () => {
    setEditingFaculty(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      employeeId: '',
      departmentId: departments[0]?.id || '',
      designation: 'Assistant Professor',
      phone: '',
      qualification: 'M.Tech / Ph.D.'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (fac) => {
    setEditingFaculty(fac);
    setFormData({
      username: fac.username,
      email: fac.email,
      password: '',
      fullName: fac.fullName,
      employeeId: fac.employeeId,
      departmentId: fac.departmentId,
      designation: fac.designation || '',
      phone: fac.phone || '',
      qualification: fac.qualification || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await adminService.updateFaculty(editingFaculty.id, formData);
        toast.success('Faculty profile updated');
      } else {
        await adminService.createFaculty(formData);
        toast.success('Faculty member created successfully');
      }
      setIsModalOpen(false);
      loadFaculties();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.toggleFacultyStatus(id);
      toast.success('Faculty account status toggled');
      loadFaculties();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Management</h1>
          <p className="text-sm text-slate-500">Manage teaching staff accounts, designations, and departmental affiliations</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <select
          value={departmentId}
          onChange={(e) => { setDepartmentId(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading faculty members..." />
        ) : faculties.length === 0 ? (
          <div className="text-center py-16 px-4">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No faculty members found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting search parameters or create a faculty account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Employee ID</th>
                  <th className="py-4 px-6">Name & Designation</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Assigned Subjects</th>
                  <th className="py-4 px-6">Contact</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculties.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono font-bold text-purple-600">
                      {fac.employeeId}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div>{fac.fullName}</div>
                      <div className="text-xs text-slate-400 font-normal">{fac.designation || 'Faculty'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">{fac.departmentCode}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        {fac.assignedSubjectsCount} Courses
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      <div>{fac.email}</div>
                      <div className="text-slate-400">{fac.phone || '-'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={fac.active ? 'success' : 'danger'}>
                        {fac.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(fac)}
                        title="Edit Faculty"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(fac.id)}
                        title={fac.active ? 'Deactivate Account' : 'Activate Account'}
                        className={`p-1.5 rounded-lg transition ${
                          fac.active
                            ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
                            : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? `Edit Faculty: ${editingFaculty.employeeId}` : 'Register Faculty Member'}
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
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee ID *</label>
              <input
                type="text"
                required
                disabled={!!editingFaculty}
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="e.g. FAC-CSE-005"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Username *</label>
              <input
                type="text"
                required
                disabled={!!editingFaculty}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. prof.john"
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
                {editingFaculty ? 'Reset Password (optional)' : 'Password (optional - default Faculty@123)'}
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
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Associate Professor"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-600/20"
            >
              {editingFaculty ? 'Save Changes' : 'Register Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

