import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { facultyService } from '../../services/facultyService';
import { reportService } from '../../services/reportService';
import { Badge, GradeBadge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Save, Send, Download, AlertCircle, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const MarksEntryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId');

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || '');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState('');

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Client-side grade calculation helper
  const calculateGradeLive = (internal, external) => {
    const intVal = parseFloat(internal) || 0;
    const extVal = parseFloat(external) || 0;
    const total = Math.round((intVal + extVal) * 10) / 10;
    const pct = Math.round(total * 10) / 10;

    let grade = 'F';
    if (pct >= 90) grade = 'O';
    else if (pct >= 80) grade = 'A+';
    else if (pct >= 70) grade = 'A';
    else if (pct >= 60) grade = 'B+';
    else if (pct >= 50) grade = 'B';
    else if (pct >= 40) grade = 'C';

    return { total, pct, grade };
  };

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      loadRoster();
    }
  }, [selectedSubjectId, selectedYearId]);

  const loadInitial = async () => {
    try {
      const [subs, years] = await Promise.all([
        facultyService.getAssignedSubjects(),
        facultyService.getAcademicYears()
      ]);
      setSubjects(subs || []);
      setAcademicYears(years || []);

      const curYear = (years || []).find(y => y.current)?.id || years[0]?.id || '';
      setSelectedYearId(curYear);

      if (!selectedSubjectId && subs?.length > 0) {
        setSelectedSubjectId(subs[0].id.toString());
      }
    } catch {
      toast.error('Failed to load assigned subjects');
    }
  };

  const loadRoster = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getStudentRoster(selectedSubjectId, selectedYearId || undefined);
      // Initialize local editing state
      const initialized = (data || []).map(item => ({
        ...item,
        inputInternal: item.internalMarks != null ? item.internalMarks.toString() : '',
        inputExternal: item.externalMarks != null ? item.externalMarks.toString() : '',
        inputRemarks: item.remarks || '',
        ...calculateGradeLive(item.internalMarks, item.externalMarks)
      }));
      setRoster(initialized);
    } catch (err) {
      toast.error(err.message || 'Failed to load student roster');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (index, field, value) => {
    setRoster(prev => {
      const updated = [...prev];
      const row = { ...updated[index] };

      if (field === 'internal') {
        row.inputInternal = value;
      } else if (field === 'external') {
        row.inputExternal = value;
      } else if (field === 'remarks') {
        row.inputRemarks = value;
      }

      // Recompute total & grade preview
      const calc = calculateGradeLive(row.inputInternal, row.inputExternal);
      row.total = calc.total;
      row.pct = calc.pct;
      row.grade = calc.grade;

      updated[index] = row;
      return updated;
    });
  };

  const handleSave = async (isDraft) => {
    // Validate bounds
    for (const row of roster) {
      const intVal = parseFloat(row.inputInternal);
      const extVal = parseFloat(row.inputExternal);

      if (row.inputInternal !== '' && (isNaN(intVal) || intVal < 0 || intVal > 50)) {
        toast.error(`Invalid internal marks for ${row.rollNumber}: must be between 0 and 50`);
        return;
      }
      if (row.inputExternal !== '' && (isNaN(extVal) || extVal < 0 || extVal > 50)) {
        toast.error(`Invalid external marks for ${row.rollNumber}: must be between 0 and 50`);
        return;
      }
    }

    setSaving(true);
    try {
      const marksList = roster.map(r => ({
        enrollmentId: r.enrollmentId,
        internalMarks: r.inputInternal !== '' ? parseFloat(r.inputInternal) : 0,
        externalMarks: r.inputExternal !== '' ? parseFloat(r.inputExternal) : 0,
        remarks: r.inputRemarks
      }));

      await facultyService.saveMarks({
        subjectId: parseInt(selectedSubjectId),
        academicYearId: parseInt(selectedYearId),
        draft: isDraft,
        marksList
      });

      toast.success(isDraft ? 'Draft marks saved successfully!' : 'Marks submitted for review & publication!');
      loadRoster();
    } catch (err) {
      toast.error(err.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await reportService.exportSubjectMarksCsv(selectedSubjectId, selectedYearId);
      toast.success('Subject marks exported to CSV');
    } catch (err) {
      toast.error(err.message || 'Failed to export CSV');
    }
  };

  const selectedSubject = subjects.find(s => s.id === parseInt(selectedSubjectId));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessment Marks Entry</h1>
          <p className="text-sm text-slate-500">Record Continuous Internal Assessment (50) and Semester Examination (50) scores</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={!selectedSubjectId || roster.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Subject and Session Selectors */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Assigned Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSearchParams({ subjectId: e.target.value });
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.semesterName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Academic Session
            </label>
            <select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {academicYears.map(y => (
                <option key={y.id} value={y.id}>{y.yearCode} {y.current ? '(Current)' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedSubject && (
          <div className="flex items-center gap-3 text-xs bg-purple-50 border border-purple-100 p-3 rounded-xl text-purple-800">
            <BookOpen className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <span className="font-bold">{selectedSubject.credits} Credits</span> Course
              <span className="mx-1.5">•</span>
              Internal Max: <span className="font-bold">50</span> | External Max: <span className="font-bold">50</span>
            </div>
          </div>
        )}
      </div>

      {/* Roster Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading subject student roster..." />
        ) : roster.length === 0 ? (
          <div className="text-center py-16 px-4">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No students enrolled in this course</h3>
            <p className="text-xs text-slate-400 mt-1">Students enrolled in this department and semester will appear here automatically.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Roll Number</th>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-4 w-32">Internal (0-50)</th>
                    <th className="py-4 px-4 w-32">External (0-50)</th>
                    <th className="py-4 px-4 text-center">Total (100)</th>
                    <th className="py-4 px-4 text-center">Grade</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-6">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((row, idx) => {
                    const isPublished = row.published;
                    const isIntInvalid = row.inputInternal !== '' && (parseFloat(row.inputInternal) < 0 || parseFloat(row.inputInternal) > 50);
                    const isExtInvalid = row.inputExternal !== '' && (parseFloat(row.inputExternal) < 0 || parseFloat(row.inputExternal) > 50);

                    return (
                      <tr key={row.enrollmentId} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-mono font-bold text-purple-700">
                          {row.rollNumber}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {row.studentName}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            disabled={isPublished}
                            value={row.inputInternal}
                            onChange={(e) => handleMarkChange(idx, 'internal', e.target.value)}
                            placeholder="0 - 50"
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm font-mono text-center outline-none transition ${
                              isPublished
                                ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                                : isIntInvalid
                                ? 'border-rose-400 bg-rose-50 text-rose-700'
                                : 'border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            disabled={isPublished}
                            value={row.inputExternal}
                            onChange={(e) => handleMarkChange(idx, 'external', e.target.value)}
                            placeholder="0 - 50"
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm font-mono text-center outline-none transition ${
                              isPublished
                                ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                                : isExtInvalid
                                ? 'border-rose-400 bg-rose-50 text-rose-700'
                                : 'border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            }`}
                          />
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">
                          {row.total != null ? row.total : '-'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <GradeBadge grade={row.grade} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                              <Lock className="w-3.5 h-3.5" /> Published
                            </span>
                          ) : row.draft ? (
                            <Badge variant="warning">Draft</Badge>
                          ) : (
                            <Badge variant="info">Submitted</Badge>
                          )}
                        </td>
                        <td className="py-3 px-6">
                          <input
                            type="text"
                            disabled={isPublished}
                            value={row.inputRemarks}
                            onChange={(e) => handleMarkChange(idx, 'remarks', e.target.value)}
                            placeholder="Optional remark..."
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-purple-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Total Roster Size: <span className="font-bold text-slate-700">{roster.length} Students</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
                </button>

                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{saving ? 'Submitting...' : 'Submit Marks for Review'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

