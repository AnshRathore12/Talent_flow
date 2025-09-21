import React, { useState } from 'react';
import { 
  PlusIcon, 
  EyeIcon, 
  PlayIcon, 
  ClipboardDocumentListIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAssessments } from '../hooks/useAssessments';
import { useJobs } from '../hooks/useJobsDatabase';
import { toast } from 'react-hot-toast';

function AssessmentsPage() {
  const companyId = 1; // Default company ID - could come from auth context
  const { 
    data, 
    isLoading, 
    error, 
    createAssessment, 
    updateAssessment, 
    launchAssessment: launchAssessmentInDB, 
    deleteAssessment: deleteAssessmentFromDB 
  } = useAssessments(companyId);
  
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  
  const assessments = data?.assessments || [];
  const jobs = jobsData?.jobs || [];
  
  const [currentView, setCurrentView] = useState('list');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  
  // Assessment taking state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    jobId: '',
    numberOfQuestions: 1,
    questions: []
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: '⚪' },
    { value: 'single-choice', label: 'Single Choice', icon: '🔘' },
    { value: 'text', label: 'Text Answer', icon: '📝' },
    { value: 'numeric', label: 'Numeric Answer', icon: '🔢' },
    { value: 'yes-no', label: 'Yes/No', icon: '✅' }
  ];

  const initializeQuestions = (numberOfQuestions) => {
    const questions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      questions.push({
        id: i + 1,
        type: 'multiple-choice',
        question: '',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: '',
        required: true,
        points: 1
      });
    }
    setCreateFormData(prev => ({ ...prev, questions }));
  };

  const handleQuestionCountChange = (count) => {
    const numberOfQuestions = Math.max(1, Math.min(50, count));
    setCreateFormData(prev => ({ ...prev, numberOfQuestions }));
    initializeQuestions(numberOfQuestions);
  };

  const updateQuestion = (questionIndex, field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  // Update question options
  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setCreateFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, i) => i === optionIndex ? value : opt)
            } 
          : q
      )
    }));
  };

  // Add option to question
  const addOption = (questionIndex) => {
    setCreateFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    }));
  };

  // Remove option from question
  const removeOption = (questionIndex, optionIndex) => {
    setCreateFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      )
    }));
  };

  const saveAssessment = async () => {
    try {
      const assessmentData = {
        ...createFormData,
        companyId
      };
      
      await createAssessment(assessmentData);
      
      // Reset form
      setCreateFormData({
        title: '',
        description: '',
        jobId: '',
        numberOfQuestions: 1,
        questions: []
      });
      
      setCurrentView('list');
      toast.success('Assessment saved successfully!');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    }
  };

  const handleLaunchAssessment = async (assessmentId) => {
    try {
      await launchAssessmentInDB(assessmentId);
      toast.success('Assessment launched successfully!');
      // Navigate to assessment taking interface
      setSelectedAssessment(assessments.find(a => a.id === assessmentId));
      setCurrentView('take');
    } catch (error) {
      console.error('Error launching assessment:', error);
      toast.error('Failed to launch assessment. Please try again.');
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        await deleteAssessmentFromDB(assessmentId);
        toast.success('Assessment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error('Failed to delete assessment. Please try again.');
      }
    }
  };

  // Assessment taking functions
  const startAssessment = () => {
    setCurrentView('taking');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNextQuestion = () => {
    if (selectedAssessment && currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      // Here you would normally submit to the database
      console.log('Submitting assessment answers:', answers);
      toast.success('Assessment submitted successfully!');
      setCurrentView('list');
      setSelectedAssessment(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!createFormData.title || !createFormData.jobId) return false;
    return createFormData.questions.every(q => {
      if (!q.question) return false;
      if (['multiple-choice', 'single-choice'].includes(q.type)) {
        return q.options.length >= 2 && q.correctAnswer;
      }
      return true;
    });
  };

  if (isLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Assessments...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Assessments</h3>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
              <p className="text-gray-600 mt-2">Create, manage and launch assessments for your job positions</p>
            </div>
            
            {currentView === 'list' && (
              <button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create Assessment</span>
              </button>
            )}
            
            {currentView !== 'list' && (
              <button
                onClick={() => setCurrentView('list')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Back to List
              </button>
            )}
          </div>
        </div>

        {currentView === 'list' && (
          <div className="space-y-6">
            {assessments.length === 0 ? (
              <div className="text-center py-16">
                <ClipboardDocumentListIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assessments Yet</h3>
                <p className="text-gray-500 mb-6">Create your first assessment to get started</p>
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium inline-flex items-center space-x-2 transition-all duration-200"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Assessment</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
                              {assessment.questions.length} questions
                            </span>
                            <span className="flex items-center">
                              <BriefcaseIcon className="w-4 h-4 mr-1" />
                              {jobs.find(j => j.id == assessment.jobId)?.title || 'Unknown Job'}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${assessment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {assessment.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAssessment(assessment);
                              setCurrentView('preview');
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                          
                          <button
                            onClick={() => handleLaunchAssessment(assessment.id)}
                            className="bg-green-50 hover:bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
                          >
                            <PlayIcon className="w-4 h-4" />
                            <span>Launch</span>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteAssessment(assessment.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'create' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Assessment</h2>
              
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Title</label>
                    <input
                      type="text"
                      value={createFormData.title}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Frontend Developer Technical Assessment"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
                    <select
                      value={createFormData.jobId}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, jobId: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a job position</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the assessment..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={createFormData.numberOfQuestions}
                    onChange={(e) => handleQuestionCountChange(parseInt(e.target.value) || 1)}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Questions</h3>
                  <span className="text-sm text-gray-500">{createFormData.questions.length} questions configured</span>
                </div>
                
                {createFormData.questions.map((question, questionIndex) => (
                  <div key={question.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h4>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your question here..."
                        />
                      </div>
                      
                      {['multiple-choice', 'single-choice'].includes(question.type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                {question.options.length > 2 && (
                                  <button
                                    onClick={() => removeOption(questionIndex, optionIndex)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => addOption(questionIndex)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              + Add Option
                            </button>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="">Select correct answer</option>
                              {question.options.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'yes-no' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                          <select
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(questionIndex, 'correctAnswer', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">Select correct answer</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(questionIndex, 'required', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                        
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-700">Points:</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={question.points}
                            onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveAssessment}
                  disabled={!isFormValid()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Save Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'preview' && selectedAssessment && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assessment Preview</h2>
                <button
                  onClick={() => handleLaunchAssessment(selectedAssessment.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Launch Assessment</span>
                </button>
              </div>
              
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">{selectedAssessment.title}</h3>
                <p className="text-blue-700 mb-4">{selectedAssessment.description}</p>
                <div className="flex items-center space-x-6 text-sm text-blue-600">
                  <span className="flex items-center">
                    <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
                    {selectedAssessment.questions.length} questions
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    Estimated time: {selectedAssessment.questions.length * 2} minutes
                  </span>
                  <span className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {selectedAssessment.questions.reduce((sum, q) => sum + q.points, 0)} total points
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedAssessment.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Question {index + 1}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{questionTypes.find(t => t.value === question.type)?.icon}</span>
                        <span>{questionTypes.find(t => t.value === question.type)?.label}</span>
                        <span>•</span>
                        <span>{question.points} {question.points === 1 ? 'point' : 'points'}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{question.question}</p>
                    
                    <div className="text-sm text-gray-500 italic">
                      [{questionTypes.find(t => t.value === question.type)?.label} question field]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'take' && selectedAssessment && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setCurrentView('list')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to Assessments
                </button>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active Assessment
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedAssessment.title}</h2>
                <p className="text-gray-600 mb-4">{selectedAssessment.description}</p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
                    {selectedAssessment.questions.length} questions
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    No time limit
                  </span>
                  <span className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {selectedAssessment.questions.reduce((sum, q) => sum + q.points, 0)} total points
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Assessment Instructions</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Read each question carefully before answering</li>
                  <li>• Required questions are marked with a red asterisk (*)</li>
                  <li>• You can navigate between questions using the navigation buttons</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• Click "Submit Assessment" when you're ready to finalize your answers</li>
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={startAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium inline-flex items-center space-x-2 transition-all duration-200"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'taking' && selectedAssessment && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
              {/* Header with progress */}
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAssessment.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-200 rounded-full h-2 w-32 mb-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round(((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100)}% Complete
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-8">
                {(() => {
                  const question = selectedAssessment.questions[currentQuestionIndex];
                  if (!question) return null;

                  return (
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>

                      {/* Answer Input based on question type */}
                      <div className="mb-8">
                        {question.type === 'multiple-choice' && (
                          <div className="space-y-3">
                            {question.options.map((option, index) => (
                              <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={answers[question.id] === option}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-900">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {question.type === 'text' && (
                          <textarea
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            rows="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Type your answer here..."
                          />
                        )}

                        {question.type === 'numeric' && (
                          <input
                            type="number"
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your numeric answer"
                          />
                        )}

                        {question.type === 'yes-no' && (
                          <div className="space-y-3">
                            {['Yes', 'No'].map((option) => (
                              <label key={option} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={answers[question.id] === option}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-900">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Navigation Footer */}
              <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setCurrentView('take');
                      setAnswers({});
                      setCurrentQuestionIndex(0);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Exit Assessment
                  </button>

                  {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                    <button
                      onClick={submitAssessment}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                  ) : (
                    <button
                      onClick={goToNextQuestion}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <span>Next</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssessmentsPage;
