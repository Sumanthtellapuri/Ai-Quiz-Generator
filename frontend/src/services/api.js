import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateQuiz = async (url) => {
  const response = await api.post('/generate_quiz', { url });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getQuizById = async (quizId) => {
  const response = await api.get(`/quiz/${quizId}`);
  return response.data;
};

export default api;
