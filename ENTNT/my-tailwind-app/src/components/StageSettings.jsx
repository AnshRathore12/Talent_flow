import React, { useState } from 'react';
import { CogIcon, PlusIcon } from '@heroicons/react/24/outline';

function StageSettings({ stages, onUpdateStages }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableStages, setEditableStages] = useState(stages);

  const addNewStage = () => {
    const newStage = {
      id: `custom-${Date.now()}`,
      name: 'New Stage',
      displayName: 'New Stage',
      color: 'gray',
      order: editableStages.length
    };
    setEditableStages([...editableStages, newStage]);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <CogIcon className="h-4 w-4 mr-2" />
          Pipeline Configuration
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary text-sm"
        >
          {isEditing ? 'Save Changes' : 'Edit Stages'}
        </button>
      </div>

      {isEditing && (
        <div className="space-y-3">
          {editableStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <input
                type="text"
                value={stage.displayName}
                onChange={(e) => {
                  const updated = [...editableStages];
                  updated[index].displayName = e.target.value;
                  setEditableStages(updated);
                }}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <select
                value={stage.color}
                onChange={(e) => {
                  const updated = [...editableStages];
                  updated[index].color = e.target.value;
                  setEditableStages(updated);
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>
            </div>
          ))}
          <button
            onClick={addNewStage}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 flex items-center justify-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Stage
          </button>
        </div>
      )}
    </div>
  );
}

export default StageSettings;
