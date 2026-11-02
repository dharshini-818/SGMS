import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      setProfile(data);
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile details..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Student Profile</h1>
        <p className="text-sm text-slate-500">Official student registry and institutional credentials</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold text-3xl shadow-inner text-white">
            {profile?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile?.fullName}</h2>
            <p className="text-sm text-indigo-100 font-mono mt-1">Roll No: {profile?.rollNumber}</p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
                {profile?.departmentName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
                {profile?.semesterName}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Username</span>
              <p className="font-semibold text-slate-900">{profile?.username}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Institutional Email</span>
              <p className="font-semibold text-slate-900">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Phone Number</span>
              <p className="font-semibold text-slate-900">{profile?.phone || 'Not recorded'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</span>
              <p className="font-semibold text-slate-900">{profile?.dateOfBirth || 'Not recorded'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Academic Session</span>
              <p className="font-semibold text-slate-900">{profile?.academicYearCode}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Residential Address</span>
              <p className="font-semibold text-slate-900">{profile?.address || 'Knowledge City Campus'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

