import React, { useState } from 'react';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ClockIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const AssessmentTaker = ({ assessment, onSubmit, onCancel, isPreview = false }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const sections = assessment?.sections || [];
  const currentSectionData = sections[currentSection] || { questions: [] };
  const questions = currentSectionData.questions || [];
  const currentQuestionData = questions[currentQuestion] || {};
  
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const completedQuestions = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  
  const isLastQuestion = currentSection === sections.length - 1 && currentQuestion === questions.length - 1;
  const isFirstQuestion = currentSection === 0 && currentQuestion === 0;
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSectionQuestions = sections[currentSection - 1].questions;
      setCurrentQuestion(prevSectionQuestions.length - 1);
    }
  };
  
  const handleAnswer = (value) => {
    const questionId = currentQuestionData.id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Prepare submission data
    const submission = {
      assessmentId: assessment.id,
      answers,
      timeSpent,
      submittedAt: new Date().toISOString(),
      isPreview
    };
    
    onSubmit(submission);
  };
  
  const renderQuestionContent = () => {
    if (!currentQuestionData) return null;
    
    const questionId = currentQuestionData.id;
    const currentAnswer = answers[questionId] || '';
    
    switch (currentQuestionData.type) {
      case 'single-choice':
        return (
          <div className="space-y-3">
            {currentQuestionData.options?.map((option) => (
              <label 
                key={option.id} 
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                  ${currentAnswer === option.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                <input
                  type="radio"
                  name={questionId}
                  value={option.id}
                  checked={currentAnswer === option.id}
                  onChange={() => handleAnswer(option.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestionData.options?.map((option) => {
              const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.id);
              
              return (
                <label 
                  key={option.id} 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="checkbox"
                    name={questionId}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => {
                      const newValue = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                      if (isSelected) {
                        handleAnswer(newValue.filter(id => id !== option.id));
                      } else {
                        handleAnswer([...newValue, option.id]);
                      }
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">{option.text}</span>
                </label>
              );
            })}
          </div>
        );
        
      case 'text':
        return (
          <div>
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
        
      case 'short-text':
        return (
          <div>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
        {isPreview && (
          <div className="absolute top-0 right-0 bg-yellow-600 text-white text-xs font-bold px-3 py-1.5 m-2 rounded-md flex items-center">
            <BeakerIcon className="w-3.5 h-3.5 mr-1" />
            PREVIEW MODE
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">{assessment.title}</h2>
        <p className="text-blue-100">{assessment.description}</p>
        {isPreview && (
          <div className="mt-3 text-xs text-blue-100 bg-blue-800/30 rounded p-2 inline-block">
            Time limits, scoring, and submission are simulated in preview mode
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div 
          className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Status bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <DocumentTextIcon className="w-4 h-4 mr-1" />
            <span>
              Question {currentQuestion + 1} of {questions.length} | Section {currentSection + 1} of {sections.length}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>Time: {formatTime(timeSpent)}</span>
        </div>
      </div>
      
      {/* Question */}
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-start">
            <h3 className="text-lg font-semibold text-gray-900 flex-grow">
              {currentQuestionData.question}
            </h3>
            {currentQuestionData.required && (
              <span className="text-red-500 text-sm font-medium ml-2">*Required</span>
            )}
          </div>
          
          {currentQuestionData.description && (
            <p className="mt-2 text-gray-600">{currentQuestionData.description}</p>
          )}
        </div>
        
        {/* Question content */}
        {renderQuestionContent()}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Exit
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={`px-4 py-2 border rounded-lg flex items-center space-x-2 
              ${isFirstQuestion 
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            `}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg flex items-center space-x-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Submit Assessment</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <span>Next</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Info footer */}
      <div className="p-3 bg-blue-50 border-t border-blue-100 flex items-center text-sm text-blue-700">
        <InformationCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>
          Your progress is automatically saved. You can return to this assessment later.
        </span>
      </div>
    </div>
  );
};

export default AssessmentTaker;
