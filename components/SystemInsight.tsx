
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SystemInsightProps {
  topic: string;
  context: string;
}

const SystemInsight: React.FC<SystemInsightProps> = ({ topic, context }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the technical distributed system workflow for this topic: "${topic}". Use this context: "${context}". Keep the explanation technical but concise (max 3 sentences). Mention Pub/Sub, Microservices, or Eventual Consistency where applicable.`,
      });
      setInsight(response.text || "Insight unavailable.");
    } catch (error) {
      console.error(error);
      setInsight("Error generating system insight.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden border-2 border-blue-400/20">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-300">Architecture Insight</h3>
        </div>
        
        {insight ? (
          <p className="text-sm leading-relaxed text-blue-50 italic">"{insight}"</p>
        ) : (
          <button 
            onClick={fetchInsight}
            disabled={loading}
            className="group flex items-center space-x-2 text-blue-300 hover:text-white transition"
          >
            <span className="text-sm font-medium">{loading ? 'Analyzing distributed flow...' : 'Generate Architectural Analysis'}</span>
            <svg className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SystemInsight;
