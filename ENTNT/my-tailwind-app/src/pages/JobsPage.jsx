import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import JobForm from '../components/JobForm';
import JobPreview from '../components/JobPreview';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '../hooks/useJobsDatabase';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);

  const { data: jobsData, isLoading, error, refetch } = useJobs();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  const jobs = jobsData?.jobs || [];

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(term) ||
        (j.tags && j.tags.some(tag => tag.toLowerCase().includes(term))) ||
        j.status.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(j => j.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, jobs]);

  const jobStats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    draft: jobs.filter(j => j.status === 'draft').length,
    archived: jobs.filter(j => j.status === 'archived').length,
  }), [jobs]);

  const handleAddJob = (jobData) => {
    console.log('Handling job submission:', jobData);
    
    const processedData = {
      ...jobData,
      tags: typeof jobData.tags === 'string' ? jobData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : jobData.tags || []
    };

    try {
      if (editingJob) {
        console.log('Updating job:', editingJob.id, processedData);
        updateJobMutation.mutate(
          { id: editingJob.id, ...processedData },
          {
            onSuccess: () => {
              setEditingJob(null);
              setIsJobModalOpen(false);
              refetch(); // Refresh the jobs list
            },
            onError: (error) => {
              console.error('Error updating job:', error);
            }
          }
        );
      } else {
        console.log('Creating new job:', processedData);
        createJobMutation.mutate(processedData, {
          onSuccess: () => {
            setIsJobModalOpen(false);
            refetch(); // Refresh the jobs list
          },
          onError: (error) => {
            console.error('Error creating job:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error in handleAddJob:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJobMutation.mutate(jobId, {
        onSuccess: () => {
          refetch(); // Refresh the jobs list
        }
      });
    }
  };

  const handleViewJob = (job) => {
    setPreviewJob(job);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'active': {
        icon: CheckCircleIcon,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200',
        glow: 'shadow-emerald-100'
      },
      'draft': {
        icon: ClockIcon,
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-200',
        glow: 'shadow-amber-100'
      },
      'archived': {
        icon: ArchiveBoxIcon,
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        badge: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-slate-200',
        glow: 'shadow-slate-100'
      }
    };
    return configs[status] || configs['draft'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Jobs</h3>
            <p className="text-gray-500">Fetching your job postings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center p-12 bg-white/80 backdrop-blur-lg rounded-3xl border border-red-200/50 shadow-2xl max-w-md">
          <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to Load Jobs</h3>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <BriefcaseIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Job Management
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">Create and manage your job postings with enterprise-grade tools</p>
                  </div>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Jobs', value: jobStats.total, color: 'from-blue-500 to-blue-600', icon: ChartBarIcon },
                    { label: 'Active', value: jobStats.active, color: 'from-emerald-500 to-emerald-600', icon: CheckCircleIcon },
                    { label: 'Draft', value: jobStats.draft, color: 'from-amber-500 to-amber-600', icon: ClockIcon },
                    { label: 'Archived', value: jobStats.archived, color: 'from-slate-500 to-slate-600', icon: ArchiveBoxIcon }
                  ].map((stat, index) => (
                    <div key={index} className="group">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`h-10 w-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-5 w-5 text-white" />
                          </div>
                          <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-4">
                <button 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={() => {
                    setEditingJob(null);
                    setIsJobModalOpen(true);
                  }}
                  disabled={createJobMutation.isPending}
                >
                  <div className="h-6 w-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <PlusIcon className="h-4 w-4" />
                  </div>
                  <span>Create Job</span>
                  <SparklesIcon className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Search & Filter Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="space-y-6">
            {/* Advanced Search */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search jobs by title, skills, department, or status..."
                  className="w-full pl-14 pr-6 py-4 bg-white/80 border border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-lg focus:shadow-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Expanded Filter Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                  <span>Filter & Sort Options</span>
                </h3>
                <div className="flex bg-white/80 rounded-2xl p-1 shadow-lg border border-gray-200/60">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Filter by Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'active', 'draft', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          statusFilter === status
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                        }`}
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none shadow-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Jobs Display */}
        {filteredAndSortedJobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl">
            <div className="text-center py-20">
              <div className="h-24 w-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm || statusFilter !== 'all' ? 'No matching jobs found' : 'Ready to post your first job?'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
                  : 'Create compelling job postings to attract top talent and build your dream team.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    setEditingJob(null);
                    setIsJobModalOpen(true);
                  }}
                >
                  Create Your First Job
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-4'}>
            {filteredAndSortedJobs.map(job => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={job.id} className={`group relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500 overflow-hidden ${viewMode === 'list' ? 'p-6' : 'p-8'}`}>
                  {/* Premium Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    {/* Improved Job Header with consistent logo size */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Fixed size logo container */}
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <BriefcaseIcon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 mb-2">
                            {job.title}
                          </h3>
                          {/* Improved inline date and applicants display */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserGroupIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">0 applicants</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.badge} shadow-lg`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="capitalize">{job.status}</span>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <TagIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">Required Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(job.tags) ? job.tags : job.tags?.split(',') || []).slice(0, 8).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200/50 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                        {(Array.isArray(job.tags) ? job.tags.length : job.tags?.split(',').length || 0) > 8 && (
                          <span className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs font-semibold rounded-xl border border-gray-200/50">
                            +{(Array.isArray(job.tags) ? job.tags.length : job.tags?.split(',').length || 0) - 8} more
                          </span>
                        )}
                        {(!job.tags || (Array.isArray(job.tags) ? job.tags.length === 0 : !job.tags.trim())) && (
                          <span className="text-sm text-gray-400 italic">No skills specified</span>
                        )}
                      </div>
                    </div>

                    {/* Premium Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleEditJob(job)}
                        disabled={updateJobMutation.isPending}
                      >
                        <PencilIcon className="h-4 w-4 group-hover/btn:text-blue-600 transition-colors duration-300" />
                        <span className="group-hover/btn:text-blue-600 transition-colors duration-300">Edit</span>
                      </button>
                      
                      <button 
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 bg-white/80 hover:bg-blue-50/80 border border-gray-200/60 hover:border-blue-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleViewJob(job)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      
                      <button 
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 bg-white/80 hover:bg-red-50/80 border border-gray-200/60 hover:border-red-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={deleteJobMutation.isPending}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Premium Modal */}
        <Modal
          isOpen={isJobModalOpen}
          onClose={() => { 
            setIsJobModalOpen(false); 
            setEditingJob(null); 
          }}
          title={
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingJob ? "Edit Job Posting" : "Create New Job"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingJob ? "Update job details and requirements" : "Add a new position to attract top talent"}
                </p>
              </div>
            </div>
          }
          size="lg"
        >
          <JobForm
            onSubmit={handleAddJob}
            onCancel={() => { 
              setIsJobModalOpen(false); 
              setEditingJob(null); 
            }}
            initialData={editingJob}
            isSubmitting={createJobMutation.isPending || updateJobMutation.isPending}
          />
        </Modal>

        <JobPreview
          job={previewJob}
          isOpen={!!previewJob}
          onClose={() => setPreviewJob(null)}
        />
      </div>
    </div>
  );
}

export default JobsPage;