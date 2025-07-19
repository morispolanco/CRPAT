import React, { useState } from 'react';
import type { AppIdeaRequest } from '../types';
import { Icon } from './Icon';

interface PromptGeneratorFormProps {
    onGenerate: (request: AppIdeaRequest) => void;
    isLoading: boolean;
}

export const PromptGeneratorForm: React.FC<PromptGeneratorFormProps> = ({ onGenerate, isLoading }) => {
    const [idea, setIdea] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onGenerate({ idea });
        }
    };
    
    return (
        <div className="p-6 md:p-8 bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                     <div>
                        <label htmlFor="app-idea" className="block mb-2 text-lg font-medium text-slate-300">
                           Campo, Industria o Profesión
                        </label>
                        <textarea
                            id="app-idea"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="Ej: Abogados, cuidado de ancianos, jardinería urbana..."
                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 outline-none resize-y"
                            rows={5}
                            required
                        />
                    </div>
                </div>
                
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading || !idea.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-sky-600 rounded-md shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Icon name="loader" className="animate-spin w-5 h-5" />
                                Generando...
                            </>
                        ) : (
                             <>
                                <Icon name="sparkles" className="w-5 h-5" />
                                Generar Prompt C.R.P.A.T.
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};