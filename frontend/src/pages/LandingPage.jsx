import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  Users,
  ShieldCheck,
  BarChart3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  School,
  FileSpreadsheet
} from 'lucide-react';

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does SGMS calculate SGPA and CGPA?",
      a: "SGMS automatically computes Semester GPA (SGPA) based on individual subject credit weightings and awarded grade points (e.g. 10.0 for O grade, 9.0 for A+, down to 0 for F). Cumulative GPA (CGPA) is computed across all officially published semesters using applicable semester credit totals."
    },
    {
      q: "Can students view unpublished or draft marks?",
      a: "No. SGMS enforces strict privacy boundaries. Students can only view officially published grades. Any draft marks saved by faculty remain hidden until authorized and published."
    },
    {
      q: "Can faculty modify marks after they are published?",
      a: "To ensure academic integrity, once marks are officially published, faculty members cannot unilaterally alter them. Changes must go through the administrator review and correction workflow, which logs every alteration in an immutable audit trail."
    },
    {
      q: "Does the system support PDF report card downloads?",
      a: "Yes. Both students and administrators can generate and download comprehensive, publication-ready PDF grade sheets with institutional branding, subject credits, internal and external assessments, and GPA totals."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Navigation */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">SGMS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
            <a href="#roles" className="hover:text-indigo-600 transition">Roles & Access</a>
            <a href="#faqs" className="hover:text-indigo-600 transition">FAQs</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-50/50 via-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Next-Gen Academic Result Management
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Academic Journey, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Simplified.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, secure, and intuitive platform for institutions to manage student records, streamline faculty assessment entry, calculate weighted GPAs, and deliver official grade reports.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              Explore Features
            </a>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono text-slate-400">sgms-portal / dashboard / preview</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Engine Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">Student Enrollment</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">1,240</h4>
                <p className="text-xs text-indigo-600 font-medium mt-1">Computer Science & Engineering</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">Average CGPA</p>
                <h4 className="text-2xl font-bold text-indigo-600 mt-1">8.65 / 10.0</h4>
                <p className="text-xs text-emerald-600 font-medium mt-1">+0.3 from previous term</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">Publication Status</p>
                <h4 className="text-2xl font-bold text-emerald-600 mt-1">100% Published</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Semester 1 Verified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Built for Academic Excellence</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything Required to Manage Student Marks</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Student & Faculty Registry</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Maintain comprehensive profiles with roll numbers, departments, semesters, contact details, and account activation controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-purple-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Dynamic Marks Entry</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Faculty enter internal and external examination scores with real-time validation, automatic total calculation, and draft saving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Weighted GPA & CGPA Engine</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Automated credit-weighted grade points calculation following 10-point scale standards with strict incomplete semester handling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Official PDF Report Cards</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Generate clean, publication-ready PDF statements of marks and export data to CSV with authorized role access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Benefits */}
      <section id="roles" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Designed for All Stakeholders</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Dedicated Interfaces for Every Role</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Administrators</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Total System Control</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Manage students, faculty, and departments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Assign teachers to course subjects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Review and authorize grade corrections</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Official result publishing workflows</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Complete system audit logging</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Faculty</h3>
                  <span className="text-xs text-purple-600 font-semibold">Effortless Marks Entry</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated views for assigned courses only</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Student roster with roll number indexing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Save drafts and submit final marks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Real-time grade distribution charts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> CSV export for departmental archives</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Students</h3>
                  <span className="text-xs text-blue-600 font-semibold">Transparent Progress</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Secure view restricted to own records</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Breakdown of internal & external scores</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Historical semester scorecards</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Real-time SGPA and cumulative CGPA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Download PDF report card anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-slate-600">Common questions regarding system mechanics and security.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#172554] text-white py-12 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">SGMS Portal</span>
          </div>
          <p className="text-xs text-slate-400 text-center md:text-left">
            © {new Date().getFullYear()} Student Grade Management System. Apex Institute of Science & Technology. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link to="/login" className="hover:text-white transition">Sign In</Link>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#roles" className="hover:text-white transition">Roles</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

