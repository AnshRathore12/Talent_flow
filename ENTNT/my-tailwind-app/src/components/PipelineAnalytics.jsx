import React from 'react';
import { ChartBarIcon, ClockIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

function PipelineAnalytics({ candidates }) {
  const analytics = {
    conversionRates: {
      'applied-to-screen': 0.65,
      'screen-to-tech': 0.45,
      'tech-to-offer': 0.30,
      'offer-to-hired': 0.85
    },
    averageTimeInStage: {
      'applied': 2,
      'screen': 5,
      'tech': 7,
      'offer': 3
    },
    totalInPipeline: candidates.length,
    bottlenecks: ['tech'] // Stages with longest average time
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Pipeline Analytics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">65%</div>
          <div className="text-sm text-gray-600">Application → Screen</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">45%</div>
          <div className="text-sm text-gray-600">Screen → Technical</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">30%</div>
          <div className="text-sm text-gray-600">Technical → Offer</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">85%</div>
          <div className="text-sm text-gray-600">Offer → Hired</div>
        </div>
      </div>
    </div>
  );
}

export default PipelineAnalytics;
