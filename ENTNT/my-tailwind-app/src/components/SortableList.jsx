import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function SortableList({ 
  items, 
  onReorder, 
  children, 
  getItemId, 
  disabled = false, 
  className = '' 
}) {
  const [activeId, setActiveId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    const item = items.find((item) => getItemId(item) === active.id);
    setDraggedItem(item || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => getItemId(item) === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }

    setActiveId(null);
    setDraggedItem(null);
  };

  if (disabled) {
    return (
      <div className={className}>
        {items.map((item, index) => children(item, index))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext 
        items={items.map(getItemId)} 
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>
          {items.map((item, index) => children(item, index))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && draggedItem ? (
          <div className="opacity-90 rotate-3 scale-105 shadow-lg">
            {children(
              draggedItem,
              items.findIndex((item) => getItemId(item) === activeId)
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableList;
