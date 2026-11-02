import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/Modal';
import { Badge, GradeBadge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Award, CheckCircle2, AlertTriangle, Edit3, Search, Filter, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const GradePublishManagement = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [isPublishedFilter, setIsPublishedFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Correction Modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [targetRecord, setTargetRecord] = useState(null);
  const [corrInternal, setCorrInternal] = useState(0);
  const [corrExternal, setCorrExternal] = useState(0);
  const [corrRemarks, setCorrRemarks] = useState('');

  // Publication State
  const [pubYearId, setPubYearId] = useState('');
  const [pubSemesterId, setPubSemesterId] = useState('');
  const [pubSubjectId, setPubSubjectId] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadGrades();
  }, [page, subjectId, semesterId, academicYearId, isPublishedFilter]);

  const loadMeta = async () => {
    try {
      const [subs, sems, years] = await Promise.all([
        adminService.getSubjects({ size: 100 }),
        adminService.getSemesters(),
        adminService.getAcademicYears()
      ]);
      setSubjects(subs?.content || []);
      setSemesters(sems || []);
      setAcademicYears(years || []);

      const curYear = (years || []).find(y => y.current)?.id || years[0]?.id || '';
      setPubYearId(curYear);
      setPubSemesterId(sems[0]?.id || '');
    } catch {
      toast.error('Failed to load filter metadata');
    }
  };

  const loadGrades = async () => {
    try {
      setLoading(true);
      const res = await adminService.getGrades({
        subjectId: subjectId || undefined,
        semesterId: semesterId || undefined,
        academicYearId: academicYearId || undefined,
        isPublished: isPublishedFilter === '' ? undefined : (isPublishedFilter === 'true'),
        search: search || undefined,
        page,
        size: 15
      });
      setGrades(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Failed to load grade records');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadGrades();
  };

  const openCorrectionModal = (gr) => {
    setTargetRecord(gr);
    setCorrInternal(gr.internalMarks || 0);
    setCorrExternal(gr.externalMarks || 0);
    setCorrRemarks('');
    setIsCorrectionModalOpen(true);
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!corrRemarks.trim()) {
      toast.error('Audit policy requires justification remarks for manual corrections');
      return;
    }

    try {
      await adminService.correctGrade(
        targetRecord.gradeRecordId,
        parseFloat(corrInternal),
        parseFloat(corrExternal),
        corrRemarks.trim()
      );
      toast.success('Grade corrected and audit log recorded');
      setIsCorrectionModalOpen(false);
      loadGrades();
    } catch (err) {
      toast.error(err.message || 'Failed to correct grade');
    }
  };

  const handlePublishAction = async (publish) => {
    if (!pubYearId || !pubSemesterId) {
      toast.error('Please select an Academic Year and Semester to publish');
      return;
    }

    setPublishing(true);
    try {
      const res = await adminService.publishResults({
        academicYearId: parseInt(pubYearId),
        semesterId: parseInt(pubSemesterId),
        subjectId: pubSubjectId ? parseInt(pubSubjectId) : null,
        publish
      });
      toast.success(`Success: ${res.publishedCount} marks records updated to ${res.status}`);
      loadGrades();
    } catch (err) {
      toast.error(err.message || 'Publication operation failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grade Review & Result Publication</h1>
        <p className="text-sm text-slate-500">Audit faculty submissions, perform authorized grade corrections, and publish official semester statements</p>
      </div>

      {/* Result Publication Control Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Publish Official Results</h3>
            <p className="text-xs text-slate-500">Published marks become instantly accessible on student dashboards and report cards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Academic Year</label>
            <select
              value={pubYearId}
              onChange={(e) => setPubYearId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {academicYears.map(y => (
                <option key={y.id} value={y.id}>{y.yearCode} {y.current ? '(Current)' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Semester</label>
            <select
              value={pubSemesterId}
              onChange={(e) => setPubSemesterId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Subject Scope (Optional)</label>
            <select
              value={pubSubjectId}
              onChange={(e) => setPubSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- All Subjects in Semester --</option>
              {subjects
                .filter(s => !pubSemesterId || s.semesterId === parseInt(pubSemesterId))
                .map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handlePublishAction(true)}
            disabled={publishing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
          >
            {publishing ? 'Processing...' : 'Publish Official Results'}
          </button>
          <button
            onClick={() => handlePublishAction(false)}
            disabled={publishing}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm disabled:opacity-50 transition"
          >
            Unpublish Selected Scope
          </button>
        </div>
      </div>

      {/* Review Filter & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={subjectId}
            onChange={(e) => { setSubjectId(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          <select
            value={isPublishedFilter}
            onChange={(e) => { setIsPublishedFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="true">Published</option>
            <option value="false">Unpublished / Draft</option>
          </select>
        </div>
      </div>

      {/* Marks Review Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading grade records..." />
        ) : grades.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No grade records found</h3>
            <p className="text-xs text-slate-400 mt-1">Faculty marks entries will populate here once saved or submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Roll Number</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Internal (50)</th>
                  <th className="py-4 px-6">External (50)</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((gr) => (
                  <tr key={gr.enrollmentId} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                      {gr.rollNumber}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {gr.studentName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-slate-700">{gr.subjectCode}</span>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{gr.subjectName}</div>
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {gr.internalMarks != null ? gr.internalMarks : '-'}
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {gr.externalMarks != null ? gr.externalMarks : '-'}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {gr.totalMarks != null ? gr.totalMarks : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <GradeBadge grade={gr.grade} />
                    </td>
                    <td className="py-4 px-6">
                      {gr.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : gr.draft ? (
                        <Badge variant="warning">Draft</Badge>
                      ) : (
                        <Badge variant="info">Submitted</Badge>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {gr.gradeRecordId && (
                        <button
                          onClick={() => openCorrectionModal(gr)}
                          title="Correct Marks (Admin Override)"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Correction Modal */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title={`Admin Grade Correction: ${targetRecord?.rollNumber} (${targetRecord?.subjectCode})`}
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Authorized Administrator Override: All corrections are recorded in the audit log.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Internal Marks (0-50)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={corrInternal}
                onChange={(e) => setCorrInternal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">External Marks (0-50)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={corrExternal}
                onChange={(e) => setCorrExternal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Correction Justification / Note *</label>
            <textarea
              rows={3}
              required
              value={corrRemarks}
              onChange={(e) => setCorrRemarks(e.target.value)}
              placeholder="e.g. Scrutiny re-evaluation: external theory paper re-check verified by Academic Dean..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCorrectionModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold"
            >
              Authorize Correction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

