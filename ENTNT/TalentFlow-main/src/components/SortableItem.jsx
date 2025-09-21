import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/24/outline';

function SortableItem({ id, children, className = '', disabled = false }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging, 
    isOver 
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? 'opacity-50 z-50' : ''}
        ${isOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${className}
      `}
      {...attributes}
      {...listeners}
    >
      {!disabled && (
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="p-1 rounded bg-white/80 backdrop-blur-sm border border-gray-300 shadow-sm">
            <Bars3Icon className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      )}
      <div className={`transition-all duration-200 ${!disabled ? 'pl-8' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default SortableItem;
