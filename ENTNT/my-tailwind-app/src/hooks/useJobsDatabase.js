import { useState, useEffect } from 'react';
import { dbService } from '../lib/database';
import { toast } from 'react-hot-toast';

// Fetch all jobs using database
export const useJobs = () => {
  const [data, setData] = useState({ jobs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const jobs = await dbService.getAllJobs();
      setData({ jobs });
    } catch (err) {
      setError(err.message);
      console.error('Error loading jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return { data, isLoading, error, refetch: loadJobs };
};

// Create a new job using database
export const useCreateJob = () => {
  const [isPending, setIsPending] = useState(false);
  
  return {
    isPending,
    mutate: async (jobData, { onSuccess, onError } = {}) => {
      try {
        setIsPending(true);
        console.log('Creating job in database:', jobData);
        
        const finalData = {
          ...jobData,
          order: Date.now(), // Use timestamp for ordering
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const id = await dbService.addJob(finalData);
        const newJob = { ...finalData, id };
        
        console.log('Job created successfully:', newJob);
        toast.success('Job created successfully!');
        if (onSuccess) onSuccess(newJob);
      } catch (error) {
        console.error('Error creating job:', error);
        toast.error('Failed to create job. Please try again.');
        if (onError) onError(error);
      } finally {
        setIsPending(false);
      }
    }
  };
};

// Update an existing job using database
export const useUpdateJob = () => {
  const [isPending, setIsPending] = useState(false);
  
  return {
    isPending,
    mutate: async ({ id, ...jobData }, { onSuccess, onError } = {}) => {
      try {
        setIsPending(true);
        console.log('Updating job in database:', id, jobData);
        
        const finalData = {
          ...jobData,
          updatedAt: new Date().toISOString()
        };
        
        await dbService.updateJob(id, finalData);
        const updatedJob = { ...finalData, id };
        
        console.log('Job updated successfully:', updatedJob);
        toast.success('Job updated successfully!');
        if (onSuccess) onSuccess(updatedJob);
      } catch (error) {
        console.error('Error updating job:', error);
        toast.error('Failed to update job. Please try again.');
        if (onError) onError(error);
      } finally {
        setIsPending(false);
      }
    }
  };
};

// Delete a job using database
export const useDeleteJob = () => {
  const [isPending, setIsPending] = useState(false);
  
  return {
    isPending,
    mutate: async (jobId, { onSuccess, onError } = {}) => {
      try {
        setIsPending(true);
        console.log('Deleting job from database:', jobId);
        
        await dbService.deleteJob(jobId);
        
        console.log('Job deleted successfully:', jobId);
        toast.success('Job deleted successfully!');
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job. Please try again.');
        if (onError) onError(error);
      } finally {
        setIsPending(false);
      }
    }
  };
};