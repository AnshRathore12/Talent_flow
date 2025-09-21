import React, { useState } from 'react';
import { FunnelIcon, CalendarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

function PipelineFilters({ onFilterChange, jobs }) {
  const [filters, setFilters] = useState({
    jobId: 'all',
    dateRange: '30',
    skills: [],
    experience: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Job Filter */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BriefcaseIcon className="inline h-4 w-4 mr-1" />
            Filter by Job
          </label>
          <select
            value={filters.jobId}
            onChange={(e) => handleFilterChange('jobId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Positions</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Applied Within
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Levels</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default PipelineFilters;
