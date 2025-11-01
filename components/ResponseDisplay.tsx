import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ResponseDisplayProps {
    response: string;
    isLoading: boolean;
    error: string | null;
    hasHistory: boolean;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading, error, hasHistory }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!response || !navigator.clipboard) return;
        try {
            await navigator.clipboard.writeText(response);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Revert after 2 seconds
        } catch (err) {
            console.error('Failed to copy content: ', err);
            // You could add user feedback for copy failure here
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="text-center text-slate-500 py-10 px-4 bg-white rounded-2xl shadow-lg border border-slate-200">
                <p className="text-lg">Your analysis will appear here.</p>
                <p className="text-sm">
                    {hasHistory
                        ? 'Enter a new topic or select one from your history.'
                        : 'Enter a topic above and click "Analyze Topic" to get started.'}
                </p>
            </div>
        );
    }

    return (
        <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 prose prose-slate max-w-none">
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 z-10 disabled:cursor-default disabled:bg-slate-100"
                aria-label={isCopied ? "Copied to clipboard" : "Copy response to clipboard"}
                disabled={isCopied}
            >
                {isCopied ? (
                    <>
                        <CheckIcon />
                        <span>Copied!</span>
                    </>
                ) : (
                    <>
                        <CopyIcon />
                        <span>Copy</span>
                    </>
                )}
            </button>
            <MarkdownRenderer content={response} />
        </div>
    );
};
