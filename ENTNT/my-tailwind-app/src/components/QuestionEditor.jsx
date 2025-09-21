import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ViewColumnsIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const QuestionEditor = ({ question = {}, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Ensure the question has all required properties
  useEffect(() => {
    const defaultQuestion = {
      id: question.id || `q-${Date.now()}`,
      type: question.type || 'short-text',
      question: question.question || 'New Question',
      required: question.required !== undefined ? question.required : true,
    };
    
    if ((defaultQuestion.type === 'single-choice' || defaultQuestion.type === 'multiple-choice') && 
        (!question.options || !Array.isArray(question.options) || question.options.length < 2)) {
      defaultQuestion.options = [
        { id: `opt1-${Date.now()}`, text: 'Option 1' },
        { id: `opt2-${Date.now()}`, text: 'Option 2' }
      ];
    }
    
    // Only trigger onChange if we needed to set defaults
    if (JSON.stringify(question) !== JSON.stringify(defaultQuestion)) {
      onChange(defaultQuestion);
    }
  }, []);
  
  const handleQuestionChange = (e) => {
    onChange({ ...question, question: e.target.value });
  };
  
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let updatedQuestion = { ...question, type: newType };
    
    // Add options if switching to a choice type
    if ((newType === 'single-choice' || newType === 'multiple-choice') && !updatedQuestion.options) {
      updatedQuestion.options = [
        { id: `opt1-${Date.now()}`, text: 'Option 1' },
        { id: `opt2-${Date.now()}`, text: 'Option 2' }
      ];
    }
    
    onChange(updatedQuestion);
  };
  
  const handleRequiredChange = (e) => {
    onChange({ ...question, required: e.target.checked });
  };
  
  const addOption = () => {
    if (!question.options) question.options = [];
    const newOptions = [
      ...question.options, 
      { id: `opt${question.options.length + 1}-${Date.now()}`, text: `Option ${question.options.length + 1}` }
    ];
    onChange({ ...question, options: newOptions });
  };
  
  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: value };
    onChange({ ...question, options: newOptions });
  };
  
  const removeOption = (index) => {
    if (question.options.length <= 2) {
      alert('A choice question must have at least 2 options');
      return;
    }
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    onChange({ ...question, options: newOptions });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between mb-3">
        <div className="flex space-x-3">
          {/* Question type selector */}
          <select 
            value={question.type} 
            onChange={handleTypeChange}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="text">Subjective (Long Text)</option>
            <option value="short-text">Short Answer</option>
            <option value="single-choice">Single Choice</option>
            <option value="multiple-choice">Multiple Choice</option>
          </select>
          
          {/* Required toggle */}
          <label className="flex items-center space-x-2 text-sm">
            <input 
              type="checkbox" 
              checked={question.required} 
              onChange={handleRequiredChange}
              className="rounded text-blue-600"
            />
            <span>Required</span>
          </label>
        </div>
        
        {/* Question actions */}
        <div className="flex space-x-1">
          <button 
            onClick={onMoveUp} 
            disabled={isFirst}
            className={`p-1.5 rounded-md ${isFirst ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onMoveDown} 
            disabled={isLast}
            className={`p-1.5 rounded-md ${isLast ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Question text */}
      <div className="mb-3">
        <input 
          type="text" 
          value={question.question} 
          onChange={handleQuestionChange}
          placeholder="Enter your question..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Question preview and answer type */}
      <div className="mt-4">
        {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Answer Options</span>
              <button 
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {question.type === 'single-choice' ? (
                      <input type="radio" disabled className="text-blue-600" />
                    ) : (
                      <input type="checkbox" disabled className="rounded text-blue-600" />
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={option.text} 
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-grow px-3 py-1.5 border rounded-md text-sm"
                  />
                  <button 
                    onClick={() => removeOption(index)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {question.type === 'text' && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <DocumentTextIcon className="w-4 h-4 mr-1" />
              <span>Long Text Response</span>
            </div>
            <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md"></div>
          </div>
        )}
        
        {question.type === 'short-text' && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <PencilIcon className="w-4 h-4 mr-1" />
              <span>Short Text Response</span>
            </div>
            <div className="w-full h-10 bg-gray-100 border border-gray-300 rounded-md"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
