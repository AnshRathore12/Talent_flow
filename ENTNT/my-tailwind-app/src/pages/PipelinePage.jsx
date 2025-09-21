import React, { useMemo, useState } from "react";
import { DndContext, closestCenter, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "../components/KanbanColumn";
import SortableCandidateCard from "../components/SortableCandidateCard";
import { useCandidates, useUpdateCandidate } from '../hooks/useCandidatesDatabase';
import { useJobs } from '../hooks/useJobsDatabase';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PlusIcon,
  CubeTransparentIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function PipelinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [dragInstructions, setDragInstructions] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState('all');
  
  const { data: candidatesData, isLoading: candidatesLoading, refetch: refetchCandidates } = useCandidates();
  const { data: jobsData } = useJobs();
  const updateCandidateMutation = useUpdateCandidate();

  const candidates = candidatesData?.candidates || [];
  const jobs = jobsData?.jobs || [];

  // Configure drag sensors for better performance and UX
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating drag
      },
    })
  );

  const candidatesWithJobInfo = useMemo(() => {
    return candidates.map(candidate => {
      const job = jobs.find(j => j.id === candidate.jobId);
      return {
        ...candidate,
        position: job?.title || 'Unknown Position'
      };
    }).filter(candidate => {
      let filtered = true;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered && (
          candidate.name.toLowerCase().includes(term) ||
          candidate.position.toLowerCase().includes(term) ||
          candidate.email?.toLowerCase().includes(term)
        );
      }
      
      if (selectedJob !== 'all') {
        filtered = filtered && candidate.jobId === parseInt(selectedJob);
      }
      
      return filtered;
    });
  }, [candidates, jobs, searchTerm, selectedJob]);

  const stages = [
    { 
      name: "applied", 
      color: "indigo", 
      displayName: "Applied",
      description: "New applications",
      icon: UserGroupIcon
    },
    { 
      name: "screen", 
      color: "amber", 
      displayName: "Screening",
      description: "Initial review",
      icon: ClockIcon
    },
    { 
      name: "tech", 
      color: "violet", 
      displayName: "Technical",
      description: "Technical assessment",
      icon: CubeTransparentIcon
    },
    { 
      name: "offer", 
      color: "orange", 
      displayName: "Offer",
      description: "Offer extended",
      icon: TrophyIcon
    },
    { 
      name: "hired", 
      color: "emerald", 
      displayName: "Hired",
      description: "Successfully hired",
      icon: FireIcon
    },
  ];

  const handleDragStart = (event) => {
    const { active } = event;
    const candidate = candidatesWithJobInfo.find(c => c.id === active.id);
    console.log('Drag started for candidate:', candidate?.name, 'Stage:', candidate?.stage);
    setActiveCandidate(candidate);
    setDragInstructions(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCandidate(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const candidateIndex = candidatesWithJobInfo.findIndex((c) => c.id === activeId);
    if (candidateIndex === -1) return;

    const currentCandidate = candidatesWithJobInfo[candidateIndex];
    let newStage = "";
    
    // First check if we dropped on a stage column
    if (typeof overId === "string" && stages.some((s) => s.name === overId)) {
      newStage = overId;
    } else {
      // If dropped on a candidate, get that candidate's stage
      const targetCandidate = candidatesWithJobInfo.find((c) => c.id === overId);
      if (targetCandidate) {
        newStage = targetCandidate.stage;
      }
    }

    // Normalize stage names to match our configuration
    const stageMap = {
      'Applied': 'applied',
      'applied': 'applied',
      'Screening': 'screen', 
      'screen': 'screen',
      'Technical': 'tech',
      'tech': 'tech',
      'Interview': 'tech', // Map interview to tech for now
      'Final': 'tech',    // Map final to tech for now  
      'Offer': 'offer',
      'offer': 'offer',
      'Hired': 'hired',
      'hired': 'hired',
      'Rejected': 'applied', // Keep rejected candidates in applied for now
      'Withdrawn': 'applied' // Keep withdrawn candidates in applied for now
    };

    const normalizedNewStage = stageMap[newStage] || newStage;
    const normalizedCurrentStage = stageMap[currentCandidate.stage] || currentCandidate.stage;

    if (normalizedNewStage && normalizedNewStage !== normalizedCurrentStage) {
      console.log(`Moving candidate ${currentCandidate.name} from ${currentCandidate.stage} to ${normalizedNewStage}`);
      console.log('Mutation payload:', {
        id: currentCandidate.id,
        updates: {
          stage: normalizedNewStage,
          stageChangeNotes: `Moved to ${normalizedNewStage} stage via kanban view on ${new Date().toLocaleDateString()}`,
          updatedAt: new Date().toISOString()
        }
      });
      
      updateCandidateMutation.mutate({
        id: currentCandidate.id,
        updates: {
          stage: normalizedNewStage,
          stageChangeNotes: `Moved to ${normalizedNewStage} stage via kanban view on ${new Date().toLocaleDateString()}`,
          updatedAt: new Date().toISOString()
        }
      }, {
        onSuccess: (result) => {
          console.log('Candidate update successful:', result);
          refetchCandidates(); // Refresh the candidates list
        },
        onError: (error) => {
          console.error('Candidate update failed:', error);
        }
      });
    } else {
      console.log('No stage change needed or invalid stage:', {
        currentStage: currentCandidate.stage,
        normalizedCurrentStage,
        newStage,
        normalizedNewStage
      });
    }
  };

  const getCandidatesByStage = (stage) => {
    // Create a mapping of candidate stages to our kanban view stages
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

    return candidatesWithJobInfo.filter((candidate) => {
      const normalizedCandidateStage = stageMap[candidate.stage] || candidate.stage.toLowerCase();
      return normalizedCandidateStage === stage;
    });
  };

  const totalCandidates = candidatesWithJobInfo.length;
  
  const kanbanStats = useMemo(() => ({
    total: candidatesWithJobInfo.length,
    applied: getCandidatesByStage('applied').length,
    screen: getCandidatesByStage('screen').length,
    tech: getCandidatesByStage('tech').length,
    offer: getCandidatesByStage('offer').length,
    hired: getCandidatesByStage('hired').length,
  }), [candidatesWithJobInfo]);

  if (candidatesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Kanban View</h3>
            <p className="text-gray-500">Organizing your hiring workflow...</p>
          </div>
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
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Squares2X2Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Kanban View
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">Drag & drop candidates through hiring stages</p>
                  </div>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Total', value: kanbanStats.total, color: 'from-blue-500 to-blue-600', icon: ChartBarIcon },
                    { label: 'Applied', value: kanbanStats.applied, color: 'from-indigo-500 to-indigo-600', icon: UserGroupIcon },
                    { label: 'Screen', value: kanbanStats.screen, color: 'from-amber-500 to-amber-600', icon: ClockIcon },
                    { label: 'Tech', value: kanbanStats.tech, color: 'from-violet-500 to-violet-600', icon: CubeTransparentIcon },
                    { label: 'Offers', value: kanbanStats.offer, color: 'from-orange-500 to-orange-600', icon: TrophyIcon },
                    { label: 'Hired', value: kanbanStats.hired, color: 'from-emerald-500 to-emerald-600', icon: FireIcon }
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
                  onClick={() => window.open('/candidates', '_blank')}
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
                  placeholder="Search candidates..."
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
                  <span>Filter Options</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Job Position Filter */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Filter by Job Position</label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/60 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none shadow-lg"
                  >
                    <option value="all">All Positions</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Banner */}
        {dragInstructions && totalCandidates > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BoltIcon className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">Interactive Kanban View</h3>
                  <p className="text-gray-600 text-sm">Drag candidates between columns to update their stage</p>
                </div>
              </div>
              <button 
                onClick={() => setDragInstructions(false)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 rounded-xl transition-all duration-200 font-medium"
              >
                Got it ✓
              </button>
            </div>
          </div>
        )}

        {/* Dark Kanban Board */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.name}
                stage={stage.name}
                displayName={stage.displayName}
                description={stage.description}
                icon={stage.icon}
                candidates={getCandidatesByStage(stage.name)}
                stageColor={stage.color}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate ? (
              <div className="transform rotate-2 scale-105 opacity-95 z-50">
                <SortableCandidateCard candidate={activeCandidate} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {totalCandidates === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl">
            <div className="text-center py-20">
              <div className="h-24 w-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <Squares2X2Icon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No candidates in pipeline</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                Add candidates to see them move through your hiring stages.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.open('/candidates', '_blank')}
                >
                  Add Candidate
                </button>
                <button 
                  className="bg-white/80 hover:bg-gray-50/80 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-2xl font-semibold border border-gray-300/60 hover:border-gray-400/60 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open('/jobs', '_blank')}
                >
                  View Jobs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PipelinePage;