import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicForm } from './components/TopicForm';
import { ResponseDisplay } from './components/ResponseDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { analyzeTopic } from './services/geminiService';
import type { HistoryItem } from './types';

const generateSummary = (responseText: string): string => {
    const summaryMatch = responseText.match(/## Summary\s*([\s\S]*?)\s*##/);
    if (summaryMatch && summaryMatch[1]) {
        const summaryText = summaryMatch[1].trim();
        return summaryText.length > 150 ? summaryText.substring(0, 147) + '...' : summaryText;
    }
    return responseText.substring(0, 150) + '...';
};

const App: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
    const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('eduframe-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
            setHistory([]);
        }
    }, []);

    const updateHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem('eduframe-history', JSON.stringify(newHistory));
    }

    const handleAnalyze = useCallback(async (currentTopic: string) => {
        if (!currentTopic.trim()) {
            setError('Please enter a topic to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponse('');
        setActiveHistoryId(null);

        try {
            const result = await analyzeTopic(currentTopic);
            setResponse(result);

            const newHistoryItem: HistoryItem = {
                id: crypto.randomUUID(),
                topic: currentTopic,
                response: result,
                timestamp: Date.now(),
                summary: generateSummary(result)
            };

            const newHistory = [newHistoryItem, ...history];
            updateHistory(newHistory);
            setActiveHistoryId(newHistoryItem.id);

        } catch (err) {
            console.error('Error analyzing topic:', err);
            setError('An error occurred while analyzing the topic. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [history]);
    
    const handleSelectHistory = (id: string) => {
        const selectedItem = history.find(item => item.id === id);
        if (selectedItem) {
            setTopic(selectedItem.topic);
            setResponse(selectedItem.response);
            setActiveHistoryId(id);
            setError(null);
            setIsHistoryVisible(false); // Close panel on selection for better UX on mobile
        }
    };
    
    const handleDeleteHistory = (id: string) => {
        const newHistory = history.filter(item => item.id !== id);
        updateHistory(newHistory);
        if (activeHistoryId === id) {
            setActiveHistoryId(null);
            setResponse('');
            setTopic('');
        }
    };

    const handleClearHistory = () => {
        updateHistory([]);
        setActiveHistoryId(null);
        setResponse('');
        setTopic('');
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
            <main className={`container mx-auto px-4 py-8 md:py-12 transition-all duration-300 ease-in-out ${isHistoryVisible ? 'md:mr-80' : ''}`}>
                <Header onToggleHistory={() => setIsHistoryVisible(!isHistoryVisible)} />
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
                        <TopicForm
                            topic={topic}
                            onTopicChange={setTopic}
                            onAnalyze={handleAnalyze}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="mt-8">
                        <ResponseDisplay
                            response={response}
                            isLoading={isLoading}
                            error={error}
                            hasHistory={history.length > 0}
                        />
                    </div>
                </div>
            </main>
            <HistoryPanel
                history={history}
                isVisible={isHistoryVisible}
                onClose={() => setIsHistoryVisible(false)}
                onSelectItem={handleSelectHistory}
                onDeleteItem={handleDeleteHistory}
                onClearHistory={handleClearHistory}
                activeItemId={activeHistoryId}
            />
            <footer className="text-center py-6 text-sm text-slate-500">
                <p>Powered EduFrameAI. Designed for educational purposes.  Copyright Arijit Banerjee</p>
            </footer>
        </div>
    );
};

export default App;
