import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCandidateCard from './SortableCandidateCard';
import { PlusIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

function KanbanColumn({ stage, displayName, description, icon: StageIcon, candidates, stageColor }) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: stage,
  });

  const candidateIds = candidates.map(candidate => candidate.id);

  // Add performance tracking
  const maxCapacity = 10; // Configurable capacity
  const utilizationPercentage = Math.min((candidates.length / maxCapacity) * 100, 100);
  
  // Add stage statistics
  const averageTimeInStage = candidates.length > 0 ? 
    candidates.reduce((acc, candidate) => {
      const daysInStage = Math.floor((new Date() - new Date(candidate.updatedAt || candidate.createdAt)) / (1000 * 60 * 60 * 24));
      return acc + daysInStage;
    }, 0) / candidates.length : 0;

  const getStageConfig = (color) => {
    const configs = {
      'indigo': {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        badge: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
        headerBg: 'bg-white/80',
        dropActive: 'bg-indigo-100 border-indigo-300',
        glow: 'shadow-lg shadow-indigo-200/50'
      },
      'amber': {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
        headerBg: 'bg-white/80',
        dropActive: 'bg-amber-100 border-amber-300',
        glow: 'shadow-lg shadow-amber-200/50'
      },
      'violet': {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-700',
        badge: 'bg-gradient-to-r from-violet-500 to-violet-600 text-white',
        headerBg: 'bg-white/80',
        dropActive: 'bg-violet-100 border-violet-300',
        glow: 'shadow-lg shadow-violet-200/50'
      },
      'orange': {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
        headerBg: 'bg-white/80',
        dropActive: 'bg-orange-100 border-orange-300',
        glow: 'shadow-lg shadow-orange-200/50'
      },
      'emerald': {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
        headerBg: 'bg-white/80',
        dropActive: 'bg-emerald-100 border-emerald-300',
        glow: 'shadow-lg shadow-emerald-200/50'
      }
    };
    return configs[color] || configs['indigo'];
  };

  const config = getStageConfig(stageColor);

  // Enhanced column classes with capacity warnings
  const getColumnClasses = () => {
    const baseClasses = 'bg-white/80 backdrop-blur-lg border border-gray-200/60 hover:border-gray-300/60 shadow-lg hover:shadow-xl';
    const overCapacityClasses = candidates.length > maxCapacity ? 'border-amber-300 bg-amber-50/20' : '';
    
    if (isOver && active) {
      return `
        bg-white/90 backdrop-blur-lg border-2 border-dashed ${config.border} ${config.dropActive} 
        transform scale-[1.02] ${config.glow}
      `;
    }
    return `${baseClasses} ${overCapacityClasses}`;
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      <div className={`
        rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500
        ${getColumnClasses()}
      `}>
        {/* Enhanced Column Header with more info */}
        <div className={`
          px-4 py-4 border-b border-gray-200/60 ${config.headerBg}
          ${isOver && active ? 'animate-pulse' : ''}
        `}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-xl ${config.badge} flex items-center justify-center shadow-lg`}>
                <StageIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {displayName}
                </h3>
                <p className="text-xs text-gray-600">{description}</p>
                {/* Add average time in stage */}
                {candidates.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Avg: {Math.round(averageTimeInStage)} days
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className={`
                inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-bold rounded-full
                ${config.badge} ${isOver && active ? 'animate-bounce scale-110' : ''}
                ${candidates.length > maxCapacity ? 'bg-gradient-to-r from-amber-500 to-red-500' : ''}
                transition-all duration-300
              `}>
                {candidates.length}
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar with capacity warnings */}
          <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${
                candidates.length > maxCapacity 
                  ? 'bg-gradient-to-r from-amber-500 to-red-500' 
                  : config.badge
              }`}
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
          
          {/* Capacity warning */}
          {/* {candidates.length > maxCapacity && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
              ⚠️ Over capacity - consider reviewing bottlenecks */}
            {/* </div> */}
          {/* )} */}
          
          {/* Drop Indicator */}
          {isOver && active && (
            <div className="mt-3 flex items-center justify-center text-xs font-medium text-blue-600 animate-bounce">
              <ArrowDownIcon className="w-4 h-4 mr-1" />
              <span>Drop here</span>
            </div>
          )}
        </div>

        {/* Enhanced Droppable Area */}
        <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto kanban-column">
          {candidates.length === 0 ? (
            <div className={`
              flex flex-col items-center justify-center h-full min-h-[250px] border-2 border-dashed rounded-xl
              transition-all duration-500
              ${isOver && active 
                ? `${config.border} ${config.bg} scale-105 ${config.glow}` 
                : 'border-gray-200/60 bg-gray-50/30 hover:border-gray-300/60 hover:bg-gray-100/30'
              }
            `}>
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-500
                ${isOver && active 
                  ? `${config.badge} scale-110 animate-pulse` 
                  : 'bg-gray-200/60 text-gray-400'
                }
              `}>
                {isOver && active ? (
                  <ArrowDownIcon className="w-8 h-8" />
                ) : (
                  <PlusIcon className="w-8 h-8" />
                )}
              </div>
              <h4 className={`
                font-medium mb-2 transition-colors duration-300
                ${isOver && active ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {isOver && active ? 'Drop Here' : 'No Candidates'}
              </h4>
              <p className={`
                text-xs text-center max-w-[180px] leading-relaxed transition-colors duration-300
                ${isOver && active ? config.text : 'text-gray-400'}
              `}>
                {isOver && active 
                  ? 'Release to add to this stage' 
                  : 'Candidates will appear here'
                }
              </p>
            </div>
          ) : (
            <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {candidates.map(candidate => (
                  <SortableCandidateCard key={candidate.id} candidate={candidate} />
                ))}
                
                {/* Bottom Drop Zone */}
                {isOver && active && (
                  <div className={`
                    h-16 border-2 border-dashed rounded-xl flex items-center justify-center
                    ${config.border} ${config.bg} animate-pulse ${config.glow}
                  `}>
                    <div className="text-center">
                      <ArrowDownIcon className={`w-5 h-5 mx-auto mb-1 ${config.text}`} />
                      <span className={`text-xs font-medium ${config.text}`}>
                        Add to end
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}

export default KanbanColumn;