import { useState, useEffect } from 'react';
import { dbService } from '../lib/database';

export const useAssessment = (jobId) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      dbService.getAssessmentByJobId(jobId)
        .then(setAssessment)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  return { data: assessment, isLoading: loading, error };
};

export const useSaveAssessment = () => {
  return {
    mutateAsync: async ({ jobId, ...assessmentData }) => {
      return await dbService.saveAssessment({ jobId, ...assessmentData });
    }
  };
};

export const useSubmitAssessment = () => {
  return {
    mutateAsync: async ({ jobId, ...responseData }) => {
      return await dbService.submitAssessmentResponse({ jobId, ...responseData });
    }
  };
};

// For the assessments page - managing assessments as entities with database storage
export function useAssessments(companyId = 1) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load assessments from database
  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await dbService.getAllAssessments(companyId);
      setAssessments(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new assessment
  const createAssessment = async (assessmentData) => {
    try {
      const newAssessment = {
        ...assessmentData,
        companyId,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const id = await dbService.createAssessment(newAssessment);
      const savedAssessment = { ...newAssessment, id };
      
      setAssessments(prev => [savedAssessment, ...prev]);
      return savedAssessment;
    } catch (err) {
      setError(err.message);
      console.error('Error creating assessment:', err);
      throw err;
    }
  };

  // Update assessment
  const updateAssessment = async (id, updates) => {
    try {
      await dbService.updateAssessment(id, updates);
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.id === id 
            ? { ...assessment, ...updates, updatedAt: new Date().toISOString() }
            : assessment
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating assessment:', err);
      throw err;
    }
  };

  // Launch assessment
  const launchAssessment = async (id) => {
    try {
      await dbService.launchAssessment(id);
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.id === id 
            ? { 
                ...assessment, 
                status: 'active', 
                launchedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : assessment
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error launching assessment:', err);
      throw err;
    }
  };

  // Delete assessment
  const deleteAssessment = async (id) => {
    try {
      await dbService.deleteAssessment(id);
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting assessment:', err);
      throw err;
    }
  };

  // Get assessment by ID
  const getAssessmentById = (id) => {
    return assessments.find(assessment => assessment.id === id);
  };

  useEffect(() => {
    loadAssessments();
  }, [companyId]);

  return {
    data: { assessments },
    isLoading: loading,
    error,
    createAssessment,
    updateAssessment,
    launchAssessment,
    deleteAssessment,
    getAssessmentById,
    refreshAssessments: loadAssessments
  };
}
