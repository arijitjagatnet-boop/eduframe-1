import React from 'react';

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const Header: React.FC<{ onToggleHistory: () => void }> = ({ onToggleHistory }) => {
    return (
        <header className="text-center mb-8 md:mb-12 relative">
             <button
                onClick={onToggleHistory}
                className="absolute top-0 right-0 p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Toggle history panel"
            >
                <HistoryIcon />
            </button>
            <div className="flex justify-center items-center gap-4 mb-4">
                 <div className="bg-indigo-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">EduFrame AI</h1>
            </div>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600">
                Your academic assistant for breaking down complex topics and structuring high-quality content with proven analytical frameworks.
            </p>
        </header>
    );
};
