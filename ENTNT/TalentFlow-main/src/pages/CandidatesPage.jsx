import React, { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import CandidateForm from '../components/CandidateForm';
import CandidatePreview from '../components/CandidatePreview';
import { useCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate } from '../hooks/useCandidatesDatabase';
import { useJobs } from '../hooks/useJobsDatabase';
import { 
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ChevronDownIcon,
  UserGroupIcon,
  CalendarIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  UserPlusIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [previewCandidate, setPreviewCandidate] = useState(null);
  const [deletingCandidate, setDeletingCandidate] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: candidatesData, isLoading: candidatesLoading, error: candidatesError, refetch: refetchCandidates } = useCandidates();
  const { data: jobsData } = useJobs();
  const createCandidateMutation = useCreateCandidate();
  const updateCandidateMutation = useUpdateCandidate();
  const deleteCandidateMutation = useDeleteCandidate();

  const candidates = candidatesData?.candidates || [];
  const jobs = jobsData?.jobs || [];

  const candidatesWithJobInfo = useMemo(() => {
    return candidates.map(candidate => {
      const job = jobs.find(j => j.id === candidate.jobId);
      return {
        ...candidate,
        position: job?.title || 'Unknown Position'
      };
    });
  }, [candidates, jobs]);

  const filteredAndSortedCandidates = useMemo(() => {
    // Create a mapping of candidate stages to normalized stages (same as Pipeline page)
    const stageMap = {
      'Applied': 'applied',
      'applied': 'applied',
      'Screening': 'screen', 
      'screen': 'screen',
      'Technical': 'tech',
      'tech': 'tech',
      'Interview': 'tech', // Group interview with tech
      'Final': 'tech',    // Group final with tech  
      'Offer': 'offer',
      'offer': 'offer',
      'Hired': 'hired',
      'hired': 'hired',
      'Rejected': 'applied', // Show rejected in applied column
      'Withdrawn': 'applied' // Show withdrawn in applied column
    };

    let filtered = candidatesWithJobInfo;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.position.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.stage.toLowerCase().includes(term)
      );
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(c => {
        const normalizedCandidateStage = stageMap[c.stage] || c.stage.toLowerCase();
        return normalizedCandidateStage === stageFilter;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stage':
          return a.stage.localeCompare(b.stage);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, stageFilter, sortBy, candidatesWithJobInfo]);

  const candidateStats = useMemo(() => {
    // Create a mapping of candidate stages to normalized stages (same as Pipeline page)
    const stageMap = {
      'Applied': 'applied',
      'applied': 'applied',
      'Screening': 'screen', 
      'screen': 'screen',
      'Technical': 'tech',
      'tech': 'tech',
      'Interview': 'tech', // Group interview with tech
      'Final': 'tech',    // Group final with tech  
      'Offer': 'offer',
      'offer': 'offer',
      'Hired': 'hired',
      'hired': 'hired',
      'Rejected': 'applied', // Show rejected in applied column
      'Withdrawn': 'applied' // Show withdrawn in applied column
    };

    const getCandidatesByStage = (stage) => {
      return candidates.filter((candidate) => {
        const normalizedCandidateStage = stageMap[candidate.stage] || candidate.stage.toLowerCase();
        return normalizedCandidateStage === stage;
      });
    };

    return {
      total: candidates.length,
      applied: getCandidatesByStage('applied').length,
      screen: getCandidatesByStage('screen').length,
      tech: getCandidatesByStage('tech').length,
      offer: getCandidatesByStage('offer').length,
      hired: getCandidatesByStage('hired').length,
    };
  }, [candidates]);

  const handleAdd = (data) => {
    if (editingCandidate) {
      updateCandidateMutation.mutate({ id: editingCandidate.id, updates: data }, {
        onSuccess: () => {
          setEditingCandidate(null);
          setIsModalOpen(false);
          refetchCandidates(); // Refresh the candidates list
        },
        onError: (error) => {
          console.error('Error updating candidate:', error);
        }
      });
    } else {
      createCandidateMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          refetchCandidates(); // Refresh the candidates list
        },
        onError: (error) => {
          console.error('Error creating candidate:', error);
        }
      });
    }
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleViewCandidate = (candidate) => {
    setPreviewCandidate(candidate);
  };

  const handleDeleteCandidate = (candidate) => {
    setDeletingCandidate(candidate);
  };

  const confirmDeleteCandidate = () => {
    if (deletingCandidate) {
      deleteCandidateMutation.mutate(deletingCandidate.id, {
        onSuccess: () => {
          setDeletingCandidate(null);
          refetchCandidates(); // Refresh the candidates list
        },
        onError: (error) => {
          console.error('Error deleting candidate:', error);
        }
      });
    }
  };

  const cancelDeleteCandidate = () => {
    setDeletingCandidate(null);
  };

  const getStageConfig = (stage) => {
    const configs = {
      'applied': {
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
      },
      'screen': {
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        badge: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200',
      },
      'tech': {
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        badge: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200',
      },
      'offer': {
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badge: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200',
      },
      'hired': {
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200',
      },
      'rejected': {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        badge: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200',
      }
    };
    return configs[stage] || configs['applied'];
  };

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

  if (candidatesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Candidates</h3>
            <p className="text-gray-500">Fetching candidate profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (candidatesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center p-12 bg-white/80 backdrop-blur-lg rounded-3xl border border-red-200/50 shadow-2xl max-w-md">
          <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <UserGroupIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to Load Candidates</h3>
          <p className="text-gray-600 mb-6">{candidatesError.message}</p>
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
                    <UserGroupIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Candidate Management
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">Track and manage your talent pipeline with advanced tools</p>
                  </div>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Total', value: candidateStats.total, color: 'from-blue-500 to-blue-600', icon: ChartBarIcon },
                    { label: 'Applied', value: candidateStats.applied, color: 'from-blue-500 to-blue-600', icon: UserPlusIcon },
                    { label: 'Screening', value: candidateStats.screen, color: 'from-yellow-500 to-yellow-600', icon: ClockIcon },
                    { label: 'Technical', value: candidateStats.tech, color: 'from-purple-500 to-purple-600', icon: AdjustmentsHorizontalIcon },
                    { label: 'Offers', value: candidateStats.offer, color: 'from-orange-500 to-orange-600', icon: SparklesIcon },
                    { label: 'Hired', value: candidateStats.hired, color: 'from-emerald-500 to-emerald-600', icon: CheckCircleIcon }
                  ].map((stat, index) => (
                    <div key={index} className="group">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`h-8 w-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="h-4 w-4 text-white" />
                          </div>
                          <ArrowTrendingUpIcon className="h-3 w-3 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-4">
                <button 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                  onClick={() => {
                    setEditingCandidate(null);
                    setIsModalOpen(true);
                  }}
                  disabled={createCandidateMutation.isPending}
                >
                  <div className="h-6 w-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <PlusIcon className="h-4 w-4" />
                  </div>
                  <span>Add Candidate</span>
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
                  placeholder="Search candidates by name, position, email, or stage..."
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
                {/* Stage Filter */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Filter by Stage</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'applied', 'screen', 'tech', 'offer', 'hired'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setStageFilter(stage)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          stageFilter === stage
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                        }`}
                      >
                        {stage === 'all' ? 'All' : stage.charAt(0).toUpperCase() + stage.slice(1)}
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
                    <option value="name">Name A-Z</option>
                    <option value="stage">Stage</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Candidates Display */}
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl">
            <div className="text-center py-20">
              <div className="h-24 w-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <UserGroupIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm || stageFilter !== 'all' ? 'No matching candidates found' : 'Ready to add your first candidate?'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                {searchTerm || stageFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
                  : 'Start building your talent pipeline by adding candidates to track through your hiring process.'
                }
              </p>
              {!searchTerm && stageFilter === 'all' && (
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    setEditingCandidate(null);
                    setIsModalOpen(true);
                  }}
                >
                  Add Your First Candidate
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-4'}>
            {filteredAndSortedCandidates.map(candidate => {
              const stageConfig = getStageConfig(candidate.stage);
              
              return (
                <div key={candidate.id} className={`group relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500 overflow-hidden ${viewMode === 'list' ? 'p-6' : 'p-8'}`}>
                  {/* Premium Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    {/* Candidate Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${getAvatarColor(candidate.name)} flex items-center justify-center text-white font-bold text-lg shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                          {getInitials(candidate.name)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 mb-2">
                            {candidate.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center space-x-1">
                              <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{candidate.position}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{candidate.email || 'No email'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${stageConfig.badge} shadow-lg`}>
                        <span className="capitalize">{candidate.stage}</span>
                      </div>
                    </div>

                    {/* Application Date */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Applied {candidate.createdAt 
                          ? new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : 'Recently'
                        }
                      </span>
                    </div>

                    {/* Premium Action Buttons */}
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleEditCandidate(candidate)}
                        disabled={updateCandidateMutation.isPending}
                      >
                        <PencilIcon className="h-4 w-4 group-hover/btn:text-blue-600 transition-colors duration-300" />
                        <span className="group-hover/btn:text-blue-600 transition-colors duration-300">Edit</span>
                      </button>
                      
                      <button 
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 bg-white/80 hover:bg-blue-50/80 border border-gray-200/60 hover:border-blue-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>

                      <button 
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 bg-white/80 hover:bg-red-50/80 border border-gray-200/60 hover:border-red-200/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group/btn" 
                        onClick={() => handleDeleteCandidate(candidate)}
                        disabled={deleteCandidateMutation.isPending}
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
          isOpen={isModalOpen}
          onClose={() => { 
            setIsModalOpen(false); 
            setEditingCandidate(null); 
          }}
          title={
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingCandidate ? "Update candidate information and status" : "Add a new candidate to your talent pipeline"}
                </p>
              </div>
            </div>
          }
          size="lg"
        >
          <CandidateForm
            onSubmit={handleAdd}
            onCancel={() => { 
              setIsModalOpen(false); 
              setEditingCandidate(null); 
            }}
            initialData={editingCandidate}
            jobs={jobs}
            isSubmitting={createCandidateMutation.isPending || updateCandidateMutation.isPending}
          />
        </Modal>

        <CandidatePreview
          candidate={previewCandidate}
          isOpen={!!previewCandidate}
          onClose={() => setPreviewCandidate(null)}
          jobs={jobs}
        />

        {/* Delete Confirmation Dialog */}
        <Modal
          isOpen={!!deletingCandidate}
          onClose={cancelDeleteCandidate}
          title={
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrashIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Candidate
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          }
          size="sm"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deletingCandidate?.name}</span>? 
              This will permanently remove their profile and all associated data from your system.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDeleteCandidate}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors duration-200"
                disabled={deleteCandidateMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCandidate}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-red-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={deleteCandidateMutation.isPending}
              >
                {deleteCandidateMutation.isPending ? 'Deleting...' : 'Delete Candidate'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default CandidatesPage;