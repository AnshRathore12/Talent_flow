import React from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobsDatabase';
import { useCandidates } from '../hooks/useCandidatesDatabase';
import { useAssessments } from '../hooks/useAssessments';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

function HomePage() {
  const { data: jobsData } = useJobs();
  const { data: candidatesData } = useCandidates();
  const { data: assessmentsData } = useAssessments();

  const jobs = jobsData?.jobs || [];
  const candidates = candidatesData?.candidates || [];
  const assessments = assessmentsData?.assessments || [];

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalCandidates: candidates.length,
    hired: candidates.filter(c => c.stage === 'hired').length,
    totalAssessments: assessments.length,
    activeAssessments: assessments.filter(a => a.status === 'Active').length
  };

  const recentCandidates = candidates
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
    <div className={`card-gradient ${bgColor} group cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const NavigationCard = ({ title, description, href, icon: Icon, color, bgGradient }) => (
    <Link to={href} className="group">
      <div className={`card-hover ${bgGradient} border-l-4 ${color.replace('text-', 'border-')}`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center section-spacing">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            Welcome to TalentFlow
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your comprehensive hiring platform for managing jobs, candidates, and assessments with modern workflow tools.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 section-spacing">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          subtitle={`${stats.activeJobs} active positions`}
          icon={BriefcaseIcon}
          color="text-blue-600"
          bgColor="hover:bg-blue-50"
        />
        <StatCard
          title="Candidates"
          value={stats.totalCandidates}
          subtitle={`${stats.hired} successfully hired`}
          icon={UserGroupIcon}
          color="text-green-600"
          bgColor="hover:bg-green-50"
        />
        <StatCard
          title="Assessments"
          value={stats.totalAssessments}
          subtitle={`${stats.activeAssessments} active tests`}
          icon={ClipboardDocumentListIcon}
          color="text-purple-600"
          bgColor="hover:bg-purple-50"
        />
        <StatCard
          title="Pending Offers"
          value={candidates.filter(c => c.stage === 'offer').length}
          subtitle="Awaiting responses"
          icon={ClockIcon}
          color="text-orange-600"
          bgColor="hover:bg-orange-50"
        />
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 section-spacing">
        <NavigationCard
          title="Job Management"
          description="Create, edit, and manage job postings. Track application metrics and performance analytics."
          href="/jobs"
          icon={BriefcaseIcon}
          color="text-blue-600"
          bgGradient="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <NavigationCard
          title="Candidate Tracking"
          description="Monitor candidates throughout the hiring process with detailed profiles and communication history."
          href="/candidates"
          icon={UserGroupIcon}
          color="text-green-600"
          bgGradient="bg-gradient-to-br from-green-50 to-green-100"
        />
        <NavigationCard
          title="Kanban View"
          description="Visual kanban board for managing candidate flow through different stages of your hiring process."
          href="/pipeline"
          icon={ChartBarIcon}
          color="text-purple-600"
          bgGradient="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <NavigationCard
          title="Assessment Center"
          description="Create custom assessments and tests to evaluate candidate skills and cultural fit."
          href="/assessments"
          icon={ClipboardDocumentListIcon}
          color="text-orange-600"
          bgGradient="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      {/* Recent Activity */}
      {recentCandidates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Candidates</h2>
                <Link to="/candidates" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentCandidates.map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        candidate.stage === 'hired' ? 'bg-green-100 text-green-800 border border-green-200' :
                        candidate.stage === 'offer' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        candidate.stage === 'tech' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        candidate.stage === 'screen' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        candidate.stage === 'applied' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/jobs" className="btn-primary w-full text-center block">
                  Create New Job
                </Link>
                <Link to="/candidates" className="btn-secondary w-full text-center block">
                  Add Candidate
                </Link>
                <Link to="/assessments" className="btn-secondary w-full text-center block">
                  Create Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;