import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
};

