import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  BriefcaseIcon, 
  TagIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function JobForm({ onSubmit, onCancel, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experience: 'mid',
    salary: '',
    description: '',
    requirements: '',
    tags: '',
    status: 'draft'
  });

  // Initialize form data only once when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        department: initialData.department || '',
        location: initialData.location || '',
        type: initialData.type || 'full-time',
        experience: initialData.experience || 'mid',
        salary: initialData.salary || '',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        status: initialData.status || 'draft'
      });
    } else {
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        experience: 'mid',
        salary: '',
        description: '',
        requirements: '',
        tags: '',
        status: 'draft'
      });
    }
  }, [initialData]);

  // Use useCallback to prevent function recreation on every render
  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSelectChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!formData.tags?.trim()) {
      toast.error('Required skills are needed');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
      salary: formData.salary.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      tags: formData.tags.trim(),
      // Keep existing timestamps if editing, otherwise use current time
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Form submitting job data:', submissionData);
    try {
      onSubmit(submissionData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  }, [formData, initialData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BriefcaseIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <BriefcaseIcon className="h-4 w-4 text-gray-500" />
              <span>Job Title <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleInputChange('title')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="e.g. Senior Frontend Developer"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
              <span>Department</span>
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={handleInputChange('department')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="e.g. Engineering, Marketing"
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
              onChange={handleInputChange('location')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="e.g. San Francisco, Remote"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
              <span>Salary Range</span>
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={handleInputChange('salary')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="e.g. $120,000 - $160,000"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span>Job Type</span>
            </label>
            <select
              value={formData.type}
              onChange={handleSelectChange('type')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              disabled={isSubmitting}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <UserGroupIcon className="h-4 w-4 text-gray-500" />
              <span>Experience Level</span>
            </label>
            <select
              value={formData.experience}
              onChange={handleSelectChange('experience')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              disabled={isSubmitting}
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead/Principal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-gray-500" />
              <span>Status</span>
            </label>
            <select
              value={formData.status}
              onChange={handleSelectChange('status')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              disabled={isSubmitting}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills & Requirements */}
      <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/40">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TagIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Skills & Requirements</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-gray-500" />
              <span>Required Skills <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={handleInputChange('tags')}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm"
              placeholder="e.g. React, TypeScript, Node.js, GraphQL"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <SparklesIcon className="h-3 w-3" />
              <span>Separate skills with commas for better organization</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
              <span>Job Description</span>
            </label>
            <textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={4}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm resize-none"
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-gray-500" />
              <span>Requirements & Qualifications</span>
            </label>
            <textarea
              value={formData.requirements}
              onChange={handleInputChange('requirements')}
              rows={4}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 shadow-sm resize-none"
              placeholder="List education requirements, experience, certifications, and other qualifications..."
              disabled={isSubmitting}
            />
          </div>
        </div>
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
              <CheckCircleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>{initialData ? 'Update Job' : 'Create Job'}</span>
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

export default JobForm;