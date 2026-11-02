import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Award,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Faculty', path: '/admin/faculty', icon: UserCheck },
    { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Academic Setup', path: '/admin/academic', icon: Calendar },
    { name: 'Grade Review', path: '/admin/grades', icon: Award },
    { name: 'Publish Results', path: '/admin/publish', icon: CheckCircle2 },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
  ];

  const facultyNav = [
    { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'Marks Entry', path: '/faculty/marks', icon: Award },
    { name: 'Subject Analytics', path: '/faculty/analytics', icon: BarChart3 },
  ];

  const studentNav = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'My Results', path: '/student/results', icon: Award },
    { name: 'Academic Profile', path: '/student/profile', icon: UserCheck },
  ];

  const navItems = role === 'ROLE_ADMIN' ? adminNav : (role === 'ROLE_FACULTY' ? facultyNav : studentNav);

  const roleName = role === 'ROLE_ADMIN' ? 'Administrator' : (role === 'ROLE_FACULTY' ? 'Faculty Member' : 'Student');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#172554] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">SGMS</span>
              <p className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase">Academic Portal</p>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-inner">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="text-sm font-semibold text-white truncate">{user?.fullName}</h4>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/30 text-indigo-200">
              {roleName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/faculty' || item.path === '/student'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-indigo-300" />
                <span>{item.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-slate-900">
                {role === 'ROLE_ADMIN' ? 'Admin Portal' : (role === 'ROLE_FACULTY' ? 'Faculty Portal' : 'Student Portal')}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">Apex Institute of Science & Technology</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900">{user?.fullName}</span>
              <span className="text-xs text-indigo-600 font-medium">{user?.identifier || user?.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

