import React, { useState, useEffect } from 'react';
import { getHistory, getQuizById } from '../services/api';
import Modal from '../components/Modal';
import QuizDisplay from '../components/QuizDisplay';

const HistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (quizId) => {
    setLoadingQuiz(true);
    setModalOpen(true);
    try {
      const data = await getQuizById(quizId);
      setSelectedQuiz(data.quiz_data);
    } catch (err) {
      setError('Failed to load quiz details');
      setModalOpen(false);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuiz(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz History</h2>
        
        {history.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No quizzes generated yet. Generate your first quiz in the "Generate Quiz" tab!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quiz.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-md">
                        <p className="font-medium truncate">{quiz.title}</p>
                        <a
                          href={quiz.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs truncate block"
                        >
                          {quiz.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quiz.date_generated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(quiz.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        {loadingQuiz ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <QuizDisplay quizData={selectedQuiz} />
        )}
      </Modal>
    </div>
  );
};

export default HistoryTab;
