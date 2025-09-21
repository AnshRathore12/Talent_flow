import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  ArrowsUpDownIcon,
  DocumentDuplicateIcon,
  PuzzlePieceIcon,
  HashtagIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import QuestionEditor from './QuestionEditor';

const AssessmentBuilder = ({ assessment, onChange }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [sectionExpanded, setSectionExpanded] = useState({});

  // Ensure sections exist
  useEffect(() => {
    if (!assessment.sections || !Array.isArray(assessment.sections) || assessment.sections.length === 0) {
      const updatedAssessment = {
        ...assessment,
        sections: [{
          id: 'section-1',
          title: 'General Questions',
          questions: []
        }]
      };
      onChange(updatedAssessment);
    }
  }, [assessment, onChange]);

  const handleQuestionChange = (sectionIndex, questionIndex, updatedQuestion) => {
    const newSections = [...assessment.sections];
    newSections[sectionIndex].questions[questionIndex] = updatedQuestion;
    onChange({ ...assessment, sections: newSections });
  };

  const handleAddQuestion = (sectionIndex) => {
    const newSections = [...assessment.sections];
    const currentQuestions = newSections[sectionIndex].questions;
    const defaultType = assessment.defaultQuestionType || 'short-text';
    
    const newQuestion = {
      id: `q${currentQuestions.length + 1}-${Date.now()}`,
      type: defaultType,
      question: `Question ${currentQuestions.length + 1}`,
      required: true
    };
    
    // Add options if it's a choice question
    if (defaultType === 'single-choice' || defaultType === 'multiple-choice') {
      newQuestion.options = [
        { id: `opt1-${Date.now()}`, text: 'Option 1' },
        { id: `opt2-${Date.now()}`, text: 'Option 2' }
      ];
    }
    
    newSections[sectionIndex].questions.push(newQuestion);
    onChange({ ...assessment, sections: newSections });
  };

  const handleDeleteQuestion = (sectionIndex, questionIndex) => {
    const newSections = [...assessment.sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    onChange({ ...assessment, sections: newSections });
  };

  const handleMoveQuestion = (sectionIndex, questionIndex, direction) => {
    const newSections = [...assessment.sections];
    const questions = newSections[sectionIndex].questions;
    
    if (direction === 'up' && questionIndex > 0) {
      // Swap with the question above
      [questions[questionIndex], questions[questionIndex - 1]] = 
      [questions[questionIndex - 1], questions[questionIndex]];
    } else if (direction === 'down' && questionIndex < questions.length - 1) {
      // Swap with the question below
      [questions[questionIndex], questions[questionIndex + 1]] = 
      [questions[questionIndex + 1], questions[questionIndex]];
    }
    
    onChange({ ...assessment, sections: newSections });
  };

  const handleAddSection = () => {
    const newSections = [...assessment.sections];
    const sectionNumber = newSections.length + 1;
    
    newSections.push({
      id: `section-${sectionNumber}-${Date.now()}`,
      title: `Section ${sectionNumber}`,
      questions: []
    });
    
    onChange({ ...assessment, sections: newSections });
    // Expand the new section automatically
    setSectionExpanded(prev => ({ ...prev, [newSections.length - 1]: true }));
    setActiveSection(newSections.length - 1);
  };

  const handleSectionTitleChange = (sectionIndex, newTitle) => {
    const newSections = [...assessment.sections];
    newSections[sectionIndex].title = newTitle;
    onChange({ ...assessment, sections: newSections });
  };

  const toggleSectionExpanded = (sectionIndex) => {
    setSectionExpanded(prev => ({ 
      ...prev, 
      [sectionIndex]: !prev[sectionIndex] 
    }));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Assessment Builder</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleAddSection}
            className="btn-secondary text-sm flex items-center space-x-1"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <HashtagIcon className="w-4 h-4 mr-1" />
            <span>Total Questions</span>
          </div>
          <div className="text-xl font-bold">
            {assessment.sections?.reduce((total, section) => total + (section.questions?.length || 0), 0) || 0}
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <PuzzlePieceIcon className="w-4 h-4 mr-1" />
            <span>Sections</span>
          </div>
          <div className="text-xl font-bold">
            {assessment.sections?.length || 0}
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
            <span>Default Type</span>
          </div>
          <div className="text-xl font-bold capitalize">
            {assessment.defaultQuestionType?.replace('-', ' ') || 'Single Choice'}
          </div>
        </div>
      </div>
      
      {/* Sections */}
      <div className="space-y-4">
        {assessment.sections?.map((section, sectionIndex) => (
          <div key={section?.id || sectionIndex} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Section header */}
            <div 
              className={`p-3 border-b border-gray-200 flex justify-between items-center ${activeSection === sectionIndex ? 'bg-blue-50' : ''}`}
              onClick={() => toggleSectionExpanded(sectionIndex)}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={section?.title || `Section ${sectionIndex + 1}`}
                  onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium px-2 py-1 border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-500">{section?.questions?.length || 0} questions</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  className="p-1 rounded-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionExpanded(sectionIndex);
                  }}
                >
                  {sectionExpanded[sectionIndex] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Section content (questions) */}
            {sectionExpanded[sectionIndex] && (
              <div className="p-4">
                {section?.questions?.length > 0 ? (
                  <div className="space-y-4">
                    {section.questions.map((question, questionIndex) => (
                      <QuestionEditor
                        key={question?.id || questionIndex}
                        question={question}
                        onChange={(updatedQuestion) => handleQuestionChange(sectionIndex, questionIndex, updatedQuestion)}
                        onDelete={() => handleDeleteQuestion(sectionIndex, questionIndex)}
                        onMoveUp={() => handleMoveQuestion(sectionIndex, questionIndex, 'up')}
                        onMoveDown={() => handleMoveQuestion(sectionIndex, questionIndex, 'down')}
                        isFirst={questionIndex === 0}
                        isLast={questionIndex === section.questions.length - 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No questions in this section yet</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleAddQuestion(sectionIndex)}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {assessment.sections.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">No sections in this assessment yet</p>
          <button
            onClick={handleAddSection}
            className="btn-primary flex items-center space-x-1 mx-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add First Section</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentBuilder;
