
import React from "react";
import "./QuizDisplay.css";

const QuizDisplay = ({ quizData, title, url }) => {
  const displayTitle = title || quizData?.quiz_title || 'Generated Quiz'; 

  if (!quizData) return null;

  return (
    <div className="quiz-bg">
      {/* Title & Summary Card */}
      <div className="quiz-title-card">
        <h2 className="quiz-title">{displayTitle}</h2>
        {url && (
          <p className="quiz-source">
            Source: <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#26a69a', textDecoration: 'underline' }}>{url}</a>
          </p>
        )}
        <p className="quiz-summary">{quizData.summary}</p>
      </div>

      {/* Questions Section */}
      <div className="quiz-questions-card">
        <h3 className="quiz-questions-title">
          Questions ({quizData.questions?.length || 0})
        </h3>
        <div>
          {quizData.questions?.map((question, index) => (
            <div key={index} className="quiz-question">
              <div className="quiz-question-header">
                <span>{index + 1}. {question.question}</span>
                <span className="quiz-question-topic">Topic: {question.topic_area}</span>
              </div>
              <div className="quiz-options">
                {question.options?.map((option, optIndex) => {
                  const isCorrect = option === question.correct_answer;
                  const optionLetter = String.fromCharCode(65 + optIndex);
                  return (
                    <div
                      key={optIndex}
                      className={`quiz-option${isCorrect ? ' quiz-option-correct' : ''}`}
                    >
                      <span>
                        <span style={{ fontWeight: 700, color: '#26a69a', marginRight: '10px' }}>{optionLetter}.</span>
                        {option}
                      </span>
                      {isCorrect && (
                        <span className="quiz-option-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1em', width: '1em', marginRight: '4px' }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          CORRECT ANSWER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Section - Responsive Grid */}
      <div className="quiz-meta-grid">
        {/* Key Entities */}
        <div className="quiz-meta-card">
          <h3 className="quiz-meta-title">Key Entities</h3>
          <div>
            {quizData.key_entities?.map((entity, index) => (
              <span key={index} className="quiz-meta-tag">{entity}</span>
            ))}
          </div>
        </div>
        {/* Topics */}
        <div className="quiz-meta-card">
          <h3 className="quiz-meta-title">Question Topics</h3>
          <div>
            {[...new Set(quizData.questions?.map(q => q.topic_area))].map((topic, index) => (
              <span key={index} className="quiz-meta-tag">{topic}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
