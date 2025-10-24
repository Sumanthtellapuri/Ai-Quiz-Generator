import React, { useState, useEffect } from 'react';
// Assuming 'api' is correctly mocked or available in the environment
const api = {
    fetchHistory: async () => [
        { id: 'Q1', title: 'The History of the Printing Press and Its Impact', date_generated: new Date().toISOString() },
        { id: 'Q2', title: 'Quantum Computing Fundamentals', date_generated: new Date(Date.now() - 86400000).toISOString() },
    ],
    fetchQuizDetails: async (id) => ({ 
        id: id, 
        title: `Quiz ${id} Details`,
        url: 'https://en.wikipedia.org/wiki/Example',
        quiz_data: {
            quiz_title: `Detailed Quiz for ${id}`,
            summary: "This is a detailed summary of the quiz content loaded from the backend.",
            key_entities: ["Entity A", "Entity B", "Entity C"],
            questions: [
                { question: "What is 1+1?", topic_area: "Math", options: ["2", "3", "4"], correct_answer: "2" },
                { question: "What is 2+2?", topic_area: "Math", options: ["2", "3", "4"], correct_answer: "4" },
            ]
        }
    }),
};
import Modal from '../components/Modal'; 
import QuizDisplay from '../components/QuizDisplay'; 

const HistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Mocking API call for demonstration, replace with actual api.fetchHistory()
                const data = await api.fetchHistory();
                setHistory(data);
            } catch (err) {
                setError("Failed to load quiz history. Is the backend running?");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadHistory();
    }, []);

    const fetchDetails = async (quizId) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        try {
            // Mocking API call for demonstration, replace with actual api.fetchQuizDetails(quizId)
            const data = await api.fetchQuizDetails(quizId);
            setSelectedQuiz(data);
            setIsModalOpen(true);
        } catch (err) {
            setError("Failed to load quiz details.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !history.length) return <p className="p-8 text-center text-xl text-teal-400 animate-pulse">Loading quiz history...</p>;
    if (error) return <p className="p-8 text-center text-red-500 bg-red-900/20 rounded-xl border border-red-700">{error}</p>;

    return (
        <div className="p-0 sm:p-2 md:p-6">
            <h2 className="text-3xl font-semibold mb-6 text-white border-b-2 border-teal-500/50 pb-2">Quiz History</h2>
            
            {history.length === 0 ? (
                <div className="text-center text-gray-500 p-10 bg-slate-800 rounded-xl border border-gray-700 shadow-inner">
                    <p className="text-xl font-medium">No quizzes generated yet.</p>
                    <p className="mt-2 text-gray-400">Navigate to the Generate tab to create your first quiz!</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-700">
                    <table className="min-w-full text-left bg-slate-900">
                        <thead className="bg-slate-800 border-b border-gray-700 sticky top-0">
                            <tr>
                                <th className="py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider hidden sm:table-cell">ID</th>
                                <th className="py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider">Article Title</th>
                                <th className="py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                                <th className="py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {history.map((quiz) => (
                                <tr key={quiz.id} className="hover:bg-slate-800/70 transition duration-150">
                                    <td className="py-4 px-3 sm:px-6 text-sm text-gray-400 hidden sm:table-cell">{quiz.id}</td>
                                    <td className="py-4 px-3 sm:px-6 text-sm text-white font-medium truncate max-w-xs sm:max-w-md">{quiz.title}</td>
                                    <td className="py-4 px-3 sm:px-6 text-sm text-gray-500 hidden md:table-cell">{new Date(quiz.date_generated).toLocaleDateString()}</td>
                                    <td className="py-4 px-3 sm:px-6">
                                        <button 
                                            onClick={() => fetchDetails(quiz.id)}
                                            className={`
                                                bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md 
                                                transition duration-200 ease-in-out transform hover:scale-105 active:scale-95
                                                ${isLoading ? 'opacity-60 cursor-not-allowed' : 'shadow-purple-500/40'}
                                            `}
                                            disabled={isLoading}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Quiz Details */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={`Quiz Details: ${selectedQuiz?.title || 'Loading...'}`}
            >
                {/* Note: QuizDisplay is already designed for dark background, fits well here */}
                {selectedQuiz && (
                    <QuizDisplay 
                        quizData={selectedQuiz.quiz_data} 
                        title={selectedQuiz.title} 
                        url={selectedQuiz.url}
                    />
                )}
            </Modal>
        </div>
    );
};

export default HistoryTab;
