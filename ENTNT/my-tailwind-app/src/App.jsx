import './index.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import CandidatesPage from './pages/CandidatesPage';
import PipelinePage from './pages/PipelinePage';
import AssessmentsPage from './pages/AssessmentsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 2 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;