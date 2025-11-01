import React from 'react';

// Helper function to parse and render text with bold syntax (**text**)
const renderWithBold = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;

    // Normalize line endings and split into logical blocks
    const blocks = content.replace(/\r\n/g, '\n').split(/\n{2,}/);

    return (
        <div className="space-y-4">
            {blocks.map((block, index) => {
                const trimmedBlock = block.trim();
                
                // Code blocks (```code```)
                if (trimmedBlock.startsWith('```') && trimmedBlock.endsWith('```')) {
                    const codeContent = trimmedBlock.slice(3, -3).replace(/^[a-z]+\n/, '').trim();
                    return (
                        <pre key={index} className="bg-slate-100 p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm font-mono text-slate-800">{codeContent}</code>
                        </pre>
                    );
                }

                // Blockquotes (> quote)
                if (trimmedBlock.startsWith('> ')) {
                    const quoteContent = trimmedBlock
                        .split('\n')
                        .map(line => line.replace(/^>\s?/, ''))
                        .join('\n');
                    return (
                        <blockquote key={index} className="border-l-4 border-slate-300 pl-4 italic text-slate-600">
                            {renderWithBold(quoteContent)}
                        </blockquote>
                    );
                }

                // Headings
                if (trimmedBlock.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-200">{renderWithBold(trimmedBlock.substring(3))}</h2>;
                }
                if (trimmedBlock.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-4 mb-2">{renderWithBold(trimmedBlock.substring(4))}</h3>;
                }

                // Ordered List (1. item)
                if (/^\d+\.\s/.test(trimmedBlock)) {
                    const items = trimmedBlock.split('\n').filter(item => item.trim().length > 0);
                    return (
                        <ol key={index} className="list-decimal list-outside space-y-2 text-slate-700 pl-6">
                            {items.map((item, itemIndex) => (
                                <li key={itemIndex} className="pl-2">{renderWithBold(item.replace(/^\d+\.\s/, ''))}</li>
                            ))}
                        </ol>
                    );
                }

                // Unordered List (* or - item)
                if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ')) {
                    const items = trimmedBlock.split('\n').filter(item => item.trim().length > 0);
                    return (
                        <ul key={index} className="list-disc list-outside space-y-2 text-slate-700 pl-6">
                            {items.map((item, itemIndex) => (
                                <li key={itemIndex} className="pl-2">{renderWithBold(item.substring(2))}</li>
                            ))}
                        </ul>
                    );
                }
                
                // Paragraph
                if (trimmedBlock.length > 0) {
                    return <p key={index} className="text-slate-700 leading-relaxed">{renderWithBold(trimmedBlock)}</p>;
                }
                return null;
            })}
        </div>
    );
};
