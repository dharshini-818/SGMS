import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
        <GraduationCap className="w-8 h-8" />
      </div>
      <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase">Error 404</span>
      <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 text-base text-slate-600 max-w-md">
        The academic record, dashboard view, or resource you were looking for does not exist or has been relocated.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

