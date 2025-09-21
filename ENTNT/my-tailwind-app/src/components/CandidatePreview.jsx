import React from 'react';
import Modal from './Modal';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  StarIcon,
  TagIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

function CandidatePreview({ candidate, isOpen, onClose, jobs }) {
  if (!candidate) return null;

  const job = jobs?.find(j => j.id === candidate.jobId);
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600', 
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600', 
      'from-pink-500 to-pink-600', 
      'from-indigo-500 to-indigo-600', 
      'from-yellow-500 to-yellow-600', 
      'from-red-500 to-red-600', 
      'from-teal-500 to-teal-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStageConfig = (stage) => {
    const configs = {
      'applied': { color: 'text-blue-700', bg: 'bg-blue-50', badge: 'bg-blue-600' },
      'screen': { color: 'text-yellow-700', bg: 'bg-yellow-50', badge: 'bg-yellow-600' },
      'tech': { color: 'text-purple-700', bg: 'bg-purple-50', badge: 'bg-purple-600' },
      'offer': { color: 'text-orange-700', bg: 'bg-orange-50', badge: 'bg-orange-600' },
      'hired': { color: 'text-emerald-700', bg: 'bg-emerald-50', badge: 'bg-emerald-600' },
      'rejected': { color: 'text-red-700', bg: 'bg-red-50', badge: 'bg-red-600' }
    };
    return configs[stage] || configs['applied'];
  };

  const stageConfig = getStageConfig(candidate.stage);

  // Safely parse experience and education arrays
  const experience = Array.isArray(candidate.experience) ? candidate.experience : [];
  const education = Array.isArray(candidate.education) ? candidate.education : [];
  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-4">
          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(candidate.name)} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">{getInitials(candidate.name)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{job?.title || 'Position not found'}</p>
          </div>
        </div>
      }
      size="xl"
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <span>Contact Information</span>
              </h4>
              
              <div className="space-y-3">
                {candidate.email && (
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{candidate.email}</span>
                  </div>
                )}
                
                {candidate.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{candidate.phone}</span>
                  </div>
                )}
                
                {candidate.location && (
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{candidate.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                <span>Application Status</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${stageConfig.badge} text-white`}>
                    {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                  </span>
                </div>
                
                {candidate.createdAt && (
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Applied on {new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Links */}
        {(candidate.linkedinProfile || candidate.githubProfile || candidate.portfolioUrl) && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <LinkIcon className="h-5 w-5 text-blue-600" />
              <span>Professional Links</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {candidate.linkedinProfile && (
                <a 
                  href={candidate.linkedinProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">in</span>
                  </div>
                  <span className="text-blue-700 font-medium">LinkedIn</span>
                </a>
              )}
              
              {candidate.githubProfile && (
                <a 
                  href={candidate.githubProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="h-8 w-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GH</span>
                  </div>
                  <span className="text-gray-700 font-medium">GitHub</span>
                </a>
              )}
              
              {candidate.portfolioUrl && (
                <a 
                  href={candidate.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200"
                >
                  <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <LinkIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {candidate.summary && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              <span>Professional Summary</span>
            </h4>
            <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-6">
              <BriefcaseIcon className="h-5 w-5 text-blue-600" />
              <span>Work Experience</span>
            </h4>
            
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="border-l-4 border-blue-200 pl-6 relative">
                  <div className="absolute -left-2 top-0 h-4 w-4 bg-blue-600 rounded-full"></div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900">{exp.title || 'Position Title'}</h5>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          <span>{exp.company || 'Company Name'}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        {exp.current && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed mt-3">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-6">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              <span>Education</span>
            </h4>
            
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={edu.id || index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">{edu.degree || 'Degree'}</h5>
                      <p className="text-gray-600">{edu.school || 'School Name'}</p>
                      {edu.field && (
                        <p className="text-sm text-gray-500">Field of Study: {edu.field}</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {edu.graduationYear && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Graduated {edu.graduationYear}</span>
                        </div>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <TagIcon className="h-5 w-5 text-blue-600" />
              <span>Technical Skills</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {candidate.notes && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              <span>Additional Notes</span>
            </h4>
            <p className="text-gray-700 leading-relaxed">{candidate.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CandidatePreview;
