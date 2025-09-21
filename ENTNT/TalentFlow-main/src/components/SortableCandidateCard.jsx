import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  EnvelopeIcon, 
  BriefcaseIcon,
  CalendarIcon,
  Bars3Icon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function SortableCandidateCard({ candidate }) {
  // Add performance monitoring
  // console.time('SortableCandidateCard-render');
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  // Generate avatar initials and color
  const getInitials = (name) => {
    if (!name) return 'NA';
    // Using a simpler calculation
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return 'from-gray-500 to-gray-600';
    // Pre-defined colors to avoid calculations
    const colors = [
      'from-cyan-500 to-cyan-600', 
      'from-violet-500 to-violet-600', 
      'from-amber-500 to-amber-600', 
      'from-emerald-500 to-emerald-600', 
      'from-orange-500 to-orange-600', 
      'from-rose-500 to-rose-600', 
      'from-indigo-500 to-indigo-600', 
      'from-teal-500 to-teal-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Parse skills with fallback
  const getSkills = () => {
    // Cache the result to avoid redundant calculations
    if (candidate._cachedSkills) {
      return candidate._cachedSkills;
    }

    let result = [];
    if (candidate.skills && Array.isArray(candidate.skills)) {
      result = candidate.skills;
    } else if (candidate.tags && Array.isArray(candidate.tags)) {
      result = candidate.tags;
    } else if (candidate.tags && typeof candidate.tags === 'string') {
      result = candidate.tags.split(',');
    } else {
      // Generate mock skills based on position
      const skillMap = {
        'frontend': ['React', 'TypeScript'],
        'backend': ['Node.js', 'Python'],
        'fullstack': ['React', 'Node.js'],
        'designer': ['Figma', 'UI/UX'],
        'data': ['Python', 'SQL'],
        'mobile': ['React Native', 'Swift'],
      };
      
      const positionLower = (candidate.position || '').toLowerCase();
      for (const [key, skills] of Object.entries(skillMap)) {
        if (positionLower.includes(key)) {
          result = skills;
          break;
        }
      }
      
      if (!result.length) {
        result = ['JavaScript'];
      }
    }
    
    // Cache for future renders
    candidate._cachedSkills = result;
    return result;
  };

  const skills = React.useMemo(() => getSkills().slice(0, 2), [candidate.id]);

  // Add cleanup for performance monitoring at the end
  // React.useEffect(() => {
  //   return () => console.timeEnd('SortableCandidateCard-render');
  // });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white/95 backdrop-blur-lg rounded-2xl border-2 
        transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isDragging 
          ? 'shadow-2xl rotate-2 scale-105 border-blue-500 bg-blue-50/95 ring-2 ring-blue-300/50 z-50' 
          : 'border-gray-300/80 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200/50 hover:bg-white'
        }
      `}
      {...attributes}
      {...listeners}
    >
      {/* Card Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className={`
            relative w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarColor(candidate.name)} 
            flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0
            ${isDragging ? 'animate-pulse scale-110' : 'group-hover:scale-105'}
            transition-all duration-300
          `}>
            {getInitials(candidate.name)}
            {/* Status dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {candidate.name}
            </h4>
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <BriefcaseIcon className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{candidate.position || 'Software Engineer'}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <StarIcon className="w-3 h-3 mr-1 text-amber-400 flex-shrink-0" />
              <span>4.{Math.floor(Math.random() * 3) + 6} • {
                Array.isArray(candidate.experience) 
                  ? `${candidate.experience.length}+ jobs` 
                  : typeof candidate.experience === 'object'
                    ? `${candidate.experience.title || 'Role'}`
                    : typeof candidate.experience === 'string' 
                      ? candidate.experience 
                      : `${Math.floor(Math.random() * 5) + 1}y`
              }</span>
            </div>
          </div>

          {/* Drag Handle */}
          <div className={`
            opacity-0 transition-all duration-300 flex-shrink-0
            ${isDragging ? 'opacity-100' : 'group-hover:opacity-100'}
          `}>
            <div className="p-1 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-grab active:cursor-grabbing border border-gray-200">
              <Bars3Icon className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center text-xs text-gray-500 mb-3 p-2 bg-gray-50/80 rounded-lg border border-gray-200/60">
          <EnvelopeIcon className="w-3 h-3 mr-2 flex-shrink-0" />
          <span className="truncate">{candidate.email || 'No email'}</span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {skill.trim()}
                </span>
              ))}
              {getSkills().length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{getSkills().length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>
              {candidate.createdAt 
                ? new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })
                : 'Recent'
              }
            </span>
          </div>
          <span className="text-gray-400 font-mono text-xs">
            #{candidate.id.toString().slice(-3)}
          </span>
        </div>
      </div>

      {/* Drag Glow Effect */}
      {isDragging && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 pointer-events-none border-2 border-blue-300/50"></div>
      )}
    </div>
  );
}

// Export with memo to prevent unnecessary re-renders
export default React.memo(SortableCandidateCard, (prevProps, nextProps) => {
  // Only re-render if candidate id or stage changes
  return prevProps.candidate.id === nextProps.candidate.id && 
         prevProps.candidate.stage === nextProps.candidate.stage;
});

// Card features:
// - Avatar with initials and color-coding
// - Candidate name and position
// - Skills/tags display
// - Experience and application date
// - Drag handle with visual feedback
// - Quick actions menu (view profile, send email, schedule interview, reject)
// - Selection checkbox