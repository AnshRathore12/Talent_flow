import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  LinkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

function CandidateForm({ onSubmit, onCancel, initialData, jobs, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    stage: 'applied',
    jobId: jobs?.[0]?.id || '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    linkedinProfile: '',
    githubProfile: '',
    portfolioUrl: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        stage: initialData.stage || 'applied',
        jobId: initialData.jobId || jobs?.[0]?.id || '',
        summary: initialData.summary || '',
        experience: Array.isArray(initialData.experience) ? initialData.experience : [],
        education: Array.isArray(initialData.education) ? initialData.education : [],
        skills: Array.isArray(initialData.skills) ? initialData.skills : [],
        linkedinProfile: initialData.linkedinProfile || '',
        githubProfile: initialData.githubProfile || '',
        portfolioUrl: initialData.portfolioUrl || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        stage: 'applied',
        jobId: jobs?.[0]?.id || '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        linkedinProfile: '',
        githubProfile: '',
        portfolioUrl: '',
        notes: ''
      });
    }
  }, [initialData, jobs]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Experience management
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Education management
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      school: '',
      field: '',
      graduationYear: '',
      gpa: ''
    };
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Skills management
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.jobId) {
      toast.error('Please fill in all required fields (Name, Email, Job Position)');
      return;
    }

    // Filter out empty skills
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter(skill => skill.trim()),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="Enter candidate's full name"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <EnvelopeIcon className="h-4 w-4 text-gray-500" />
              <span>Email Address <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="candidate@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <PhoneIcon className="h-4 w-4 text-gray-500" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="San Francisco, CA"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <BriefcaseIcon className="h-4 w-4 text-gray-500" />
              <span>Job Position <span className="text-red-500">*</span></span>
            </label>
            <select
              value={formData.jobId}
              onChange={(e) => handleInputChange('jobId', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              disabled={isSubmitting}
            >
              <option value="">Select a job position</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <SparklesIcon className="h-4 w-4 text-gray-500" />
              <span>Application Stage</span>
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              disabled={isSubmitting}
            >
              <option value="applied">Applied</option>
              <option value="screen">Screening</option>
              <option value="tech">Technical</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
            <DocumentTextIcon className="h-4 w-4 text-gray-500" />
            <span>Professional Summary</span>
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm resize-none"
            placeholder="Brief professional summary of the candidate..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Experience</span>
          </button>
        </div>

        <div className="space-y-6">
          {(formData.experience || []).map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 rounded-xl p-4 bg-white/50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={isSubmitting}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  placeholder="Job Title"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="Start Date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  placeholder="End Date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={exp.current || isSubmitting}
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
              </div>

              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Job description and achievements..."
                rows={3}
                className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Education</span>
          </button>
        </div>

        <div className="space-y-6">
          {(formData.education || []).map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 rounded-xl p-4 bg-white/50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={isSubmitting}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Degree (e.g., BS Computer Science)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="School/University"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Field of Study"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <input
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                  placeholder="Graduation Year"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.skills || []).map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="e.g., React, Python, AWS"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-700 p-1"
                disabled={isSubmitting}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Profiles */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <LinkIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Professional Links</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedinProfile}
              onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="https://linkedin.com/in/..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">GitHub Profile</label>
            <input
              type="url"
              value={formData.githubProfile}
              onChange={(e) => handleInputChange('githubProfile', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="https://github.com/..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Portfolio URL</label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="https://portfolio.com"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
        </div>

        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm resize-none"
          placeholder="Internal notes about the candidate..."
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200/60">
        <button 
          type="submit" 
          className="group flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <UserIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>{initialData ? 'Update Candidate' : 'Add Candidate'}</span>
            </>
          )}
        </button>
        
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 bg-white/80 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-2xl font-semibold border border-gray-300/60 hover:border-gray-400/60 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CandidateForm;