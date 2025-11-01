import React, { useState, useMemo } from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelectItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
    onClearHistory: () => void;
    onClose: () => void;
    activeItemId: string | null;
    isVisible: boolean;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1-1.995L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    history,
    onSelectItem,
    onDeleteItem,
    onClearHistory,
    onClose,
    activeItemId,
    isVisible
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = useMemo(() => {
        if (!searchTerm.trim()) {
            return history;
        }
        return history.filter(item =>
            item.topic.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [history, searchTerm]);

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside
                className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white border-l border-slate-200 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="history-heading"
            >
                <div className="flex flex-col h-full">
                    <header className="p-4 border-b border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 id="history-heading" className="text-xl font-bold text-slate-800">History</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Close history panel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                         <div className="relative text-slate-500">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by topic..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                aria-label="Search history"
                            />
                        </div>
                    </header>

                    {history.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center text-center p-4">
                            <p className="text-slate-500">Your analysis history will appear here.</p>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                         <div className="flex-grow flex items-center justify-center text-center p-4">
                            <p className="text-slate-500">No results found for "{searchTerm}".</p>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto">
                            <ul className="divide-y divide-slate-200">
                                {filteredHistory.map(item => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => onSelectItem(item.id)}
                                            className={`w-full text-left p-4 hover:bg-slate-50 focus:outline-none focus:bg-indigo-50 transition-colors ${activeItemId === item.id ? 'bg-indigo-50' : ''}`}
                                        >
                                            <h3 className="font-semibold text-slate-800 truncate">{item.topic}</h3>
                                            <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.summary}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-slate-400">
                                                    {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteItem(item.id);
                                                    }}
                                                    className="p-1 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    aria-label={`Delete entry for ${item.topic}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <footer className="p-4 border-t border-slate-200">
                        <button
                            onClick={onClearHistory}
                            disabled={history.length === 0}
                            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Clear History
                        </button>
                    </footer>
                </div>
            </aside>
        </>
    );
};