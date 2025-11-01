import React from 'react';

interface TopicFormProps {
    topic: string;
    onTopicChange: (topic: string) => void;
    onAnalyze: (topic: string) => void;
    isLoading: boolean;
}

export const TopicForm: React.FC<TopicFormProps> = ({ topic, onTopicChange, onAnalyze, isLoading }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(topic);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="topic-input" className="block text-lg font-semibold text-slate-700">
                Enter a Topic to Analyze
            </label>
            <textarea
                id="topic-input"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="e.g., The impact of renewable energy on global economies..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none shadow-sm"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : (
                    'Analyze Topic'
                )}
            </button>
        </form>
    );
};
