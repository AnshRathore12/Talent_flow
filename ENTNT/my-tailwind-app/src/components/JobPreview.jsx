import React from 'react';
import Modal from './Modal';
import { 
  BriefcaseIcon, 
  TagIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

function JobPreview({ job, isOpen, onClose }) {
  if (!job) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'draft': return ClockIcon;
      case 'archived': return ArchiveBoxIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const StatusIcon = getStatusIcon(job.status);
  const skills = Array.isArray(job.tags) ? job.tags : (job.tags?.split(',') || []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BriefcaseIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
            <p className="text-sm text-gray-500">Complete job information</p>
          </div>
        </div>
      }
      size="lg"
    >
      <div className="space-y-6">
        {/* Job Header */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BuildingOfficeIcon className="h-4 w-4" />
                  <span>TalentFlow Inc.</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Remote / San Francisco</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>$80k - $120k</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="capitalize">{job.status}</span>
            </div>
          </div>
        </div>

        {/* Job Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Job Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Posted Date</label>
                <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Type</label>
                <p className="text-gray-900">Full-time</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Experience Level</label>
                <p className="text-gray-900">Mid to Senior Level</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-900">Engineering</p>
              </div>
            </div>
          </div>

          {/* Application Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
              Application Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Applications</span>
                <span className="text-2xl font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">In Review</span>
                <span className="text-lg font-semibold text-yellow-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Interviewed</span>
                <span className="text-lg font-semibold text-blue-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Hired</span>
                <span className="text-lg font-semibold text-green-600">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TagIcon className="h-5 w-5 mr-2 text-purple-600" />
            Required Skills & Technologies
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md transition-shadow duration-200"
                >
                  {skill.trim()}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">No specific skills listed</p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="mb-4">
              We are looking for a talented and experienced professional to join our growing team. 
              This role offers an exciting opportunity to work on cutting-edge projects and contribute 
              to our company's success.
            </p>
            
            <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Develop and maintain high-quality software solutions</li>
              <li>Collaborate with cross-functional teams to deliver projects</li>
              <li>Participate in code reviews and technical discussions</li>
              <li>Mentor junior team members and share knowledge</li>
              <li>Stay updated with latest industry trends and technologies</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Bachelor's degree in Computer Science or related field</li>
              <li>3+ years of professional experience</li>
              <li>Strong problem-solving and analytical skills</li>
              <li>Excellent communication and teamwork abilities</li>
              <li>Experience with agile development methodologies</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Competitive salary and equity package</li>
              <li>Comprehensive health, dental, and vision insurance</li>
              <li>Flexible work arrangements and remote options</li>
              <li>Professional development opportunities</li>
              <li>Generous PTO and company holidays</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button className="btn-primary flex-1">
            View Applications
          </button>
          <button className="btn-secondary">
            Edit Job
          </button>
          <button className="btn-secondary">
            Share Job
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default JobPreview;
