import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

function BulkActions({ selectedCandidates, onBulkUpdate, onClearSelection }) {
  const [showActions, setShowActions] = useState(false);

  if (selectedCandidates.length === 0) return null;

  const handleBulkMove = (newStage) => {
    onBulkUpdate(selectedCandidates, { stage: newStage });
    onClearSelection();
    setShowActions(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 animate-slide-in">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCandidates.length} candidate(s) selected
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn-secondary text-sm"
          >
            Bulk Actions
          </button>
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showActions && (
        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => handleBulkMove('screen')}
            className="btn-secondary text-sm"
          >
            Move to Screening
          </button>
          <button
            onClick={() => handleBulkMove('tech')}
            className="btn-secondary text-sm"
          >
            Move to Technical
          </button>
          <button
            onClick={() => handleBulkMove('offer')}
            className="btn-secondary text-sm"
          >
            Move to Offer
          </button>
          <button
            onClick={() => handleBulkMove('rejected')}
            className="btn-danger text-sm"
          >
            Reject All
          </button>
        </div>
      )}
    </div>
  );
}

export default BulkActions;
