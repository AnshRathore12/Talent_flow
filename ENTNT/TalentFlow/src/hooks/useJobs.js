import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const API_BASE_URL = '/api';

// Fetch all jobs
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData) => {
      console.log('Creating job via API:', jobData);
      
      const finalData = {
        ...jobData,
        id: Date.now(), // Temporary ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', error);
        throw new Error(error || 'Failed to create job');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Immediately update the cache to show the new job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['jobs'], (oldData) => {
        if (!oldData) return { jobs: [data] };
        return { jobs: [...oldData.jobs, data] };
      });
      console.log('Job created successfully:', data);
      toast.success('Job created successfully!');
    },
    onError: (error) => {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  });
};

// Update an existing job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...jobData }) => {
      console.log('Updating job via API:', id, jobData);
      
      const finalData = {
        ...jobData,
        id,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', error);
        throw new Error(error || 'Failed to update job');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Immediately update the cache to show the updated job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['jobs'], (oldData) => {
        if (!oldData) return { jobs: [data] };
        return {
          jobs: oldData.jobs.map(job => job.id === data.id ? data : job)
        };
      });
      console.log('Job updated successfully:', data);
      toast.success('Job updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
    }
  });
};

// Delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId) => {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete job');
      }
      
      return { id: jobId };
    },
    onSuccess: (data) => {
      // Immediately update the cache to remove the deleted job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['jobs'], (oldData) => {
        if (!oldData) return { jobs: [] };
        return {
          jobs: oldData.jobs.filter(job => job.id !== data.id)
        };
      });
      console.log('Job deleted successfully:', data.id);
      toast.success('Job deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job. Please try again.');
    }
  });
};
