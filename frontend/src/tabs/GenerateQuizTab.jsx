import React, { useState } from 'react';
// Real API call to backend
const api = {
    generateQuiz: async (url) => {
        const response = await fetch("/api/generate_quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Quiz generation failed");
        }
        return await response.json();
    }
};
import QuizDisplay from '../components/QuizDisplay';
import './GenerateQuizTab.css';

const GenerateQuizTab = () => {
    const [url, setUrl] = useState('');
    const [quizResult, setQuizResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isValidUrl = (input) => {
        try {
            const urlObj = new URL(input);
            return urlObj.hostname.includes('wikipedia.org'); 
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setQuizResult(null);

        if (!isValidUrl(url)) {
            setError("Please enter a valid Wikipedia URL (must contain 'wikipedia.org').");
            return;
        }

        setIsLoading(true);
        try {
            // Real API call
            const data = await api.generateQuiz(url);
            setQuizResult({
                id: data.id || data.quiz_id,
                url: url,
                title: data.quiz_data?.title || data.quiz_data?.quiz_title || data.title || "Generated Quiz",
                date_generated: data.date_generated || new Date().toISOString(),
                quiz_data: data.quiz_data || data.quizData || data
            });
            setUrl("");
        } catch (err) {
            setError(err.message || "An unknown error occurred during quiz generation. Check the URL and server status.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="generate-quiz-bg">
            <div className="generate-quiz-card">
                <h2 className="generate-quiz-title">Generate New Quiz</h2>
                <form onSubmit={handleSubmit} className="generate-quiz-form">
                    <label htmlFor="wiki-url" className="generate-quiz-label">
                        Wikipedia Article URL
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            id="wiki-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="e.g., https://en.wikipedia.org/wiki/Artificial_intelligence"
                            required
                            className="generate-quiz-input"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="generate-quiz-btn"
                        >
                            {isLoading ? (
                                <span>Generating...</span>
                            ) : 'Generate Quiz'}
                        </button>
                    </div>
                </form>
                {error && (
                    <div className="generate-quiz-error" role="alert">
                        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>⚠️ Error:</span> {error}
                    </div>
                )}
                {quizResult && (
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #37474f' }}>
                        <h3 className="generate-quiz-title" style={{ fontSize: '1.5rem', color: '#26a69a', marginBottom: '1.5rem' }}>Generated Quiz Preview</h3>
                        <QuizDisplay 
                            quizData={quizResult.quiz_data} 
                            title={quizResult.title} 
                            url={quizResult.url}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateQuizTab;
