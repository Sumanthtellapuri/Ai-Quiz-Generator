import React from 'react';

const QuizDisplay = ({ quizData }) => {
  if (!quizData) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{quizData.title}</h2>
        <p className="text-lg opacity-90">{quizData.summary}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions</h3>
        <div className="space-y-6">
          {quizData.questions?.map((question, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-lg font-semibold text-gray-800 mb-3">
                {index + 1}. {question.question}
              </p>
              <div className="space-y-2 ml-4">
                {question.options?.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-md ${
                      option === question.correct_answer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                    {option === question.correct_answer && (
                      <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 ml-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Explanation:</span> {question.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key Entities</h3>
          <div className="flex flex-wrap gap-2">
            {quizData.key_entities?.map((entity, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {quizData.related_topics?.map((topic, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
