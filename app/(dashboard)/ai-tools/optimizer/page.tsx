import React, { useState } from 'react';

interface CategoryAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
}

interface PortfolioAnalysis {
  overallScore: number;
  design: CategoryAnalysis;
  content: CategoryAnalysis;
  seo: CategoryAnalysis;
  engagement: CategoryAnalysis;
}

export default function AIPortfolioOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        overallScore: 85,
        design: {
          score: 90,
          feedback: "Clean and modern design with good visual hierarchy",
          suggestions: [
            "Consider adding more visual elements to break up text blocks",
            "Improve contrast between text and background in some sections"
          ]
        },
        content: {
          score: 80,
          feedback: "Good technical content but could be more engaging for recruiters",
          suggestions: [
            "Add quantifiable achievements to project descriptions",
            "Include a brief summary at the top highlighting your unique value",
            "Expand on the business impact of your projects"
          ]
        },
        seo: {
          score: 75,
          feedback: "Basic SEO implemented but significant improvements possible",
          suggestions: [
            "Add meta descriptions to all sections",
            "Include relevant keywords throughout your content",
            "Implement structured data for better search visibility"
          ]
        },
        engagement: {
          score: 95,
          feedback: "Excellent use of interactive elements and clear CTAs",
          suggestions: [
            "Add more social proof elements like testimonials",
            "Include a newsletter signup to capture visitor information"
          ]
        }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
          AI Portfolio Optimizer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Get actionable insights to improve your portfolio&apos;s performance and recruiter appeal
        </p>
      </div>

      {!analysis ? (
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
            🎯
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Optimize Your Portfolio</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our AI will analyze your portfolio and provide personalized recommendations to improve your recruiter engagement, SEO, and overall effectiveness.
          </p>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              !isAnalyzing
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white hover:from-[#FF844B] hover:to-[#FFB088] shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing your portfolio...
              </div>
            ) : (
              'Analyze Portfolio'
            )}
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>This analysis will take approximately 30 seconds and will provide detailed recommendations.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Analysis Complete</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Here&apos;s how your portfolio performs across key areas</p>
              
              <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FF6B35"
                    strokeWidth="3"
                    strokeDasharray={`${analysis.overallScore}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#FF6B35" fontSize="8" fontWeight="bold">
                    {analysis.overallScore}%
                  </text>
                </svg>
              </div>
              
              <p className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                Your portfolio score is <span className="text-[#FF6B35] font-bold">{analysis.overallScore}/100</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {analysis.overallScore > 80 
                  ? "Excellent work! Your portfolio is performing well." 
                  : analysis.overallScore > 60 
                    ? "Good foundation with room for improvement." 
                    : "Significant improvements needed to maximize recruiter engagement."}
              </p>
            </div>
          </div>
          
          {/* Category Analysis */}
          {Object.entries(analysis).filter(([key]) => key !== 'overallScore').map(([category, data]: [string, CategoryAnalysis]) => (
            <div key={category} className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{category}</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-[#FF6B35] mr-2">{data.score}</span>
                  <span className="text-gray-500">/100</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF914D] h-2.5 rounded-full" 
                  style={{ width: `${data.score}%` }}
                ></div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">{data.feedback}</p>
              
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
              <ul className="space-y-2">
                {data.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setAnalysis(null)}
              className="px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all"
            >
              Re-analyze
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
              Apply Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}