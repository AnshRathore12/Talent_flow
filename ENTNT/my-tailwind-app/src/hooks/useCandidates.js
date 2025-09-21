import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Hook to get all candidates with optional filters
export const useCandidates = (filters = {}) => {
  const { search, stage, jobId } = filters;
  
  return useQuery({
    queryKey: ['candidates', { search, stage, jobId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (stage) params.append('stage', stage);
      if (jobId) params.append('jobId', jobId);
      
      const url = `/candidates${params.toString() ? `?${params.toString()}` : ''}`;
      return apiService.request(url);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get candidate statistics
export const useCandidateStats = () => {
  return useQuery({
    queryKey: ['candidates', 'stats'],
    queryFn: () => apiService.request('/candidates/stats'),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook to get a single candidate by ID
export const useCandidate = (id) => {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: () => apiService.request(`/candidates/${id}`),
    enabled: !!id,
  });
};

// Hook to get candidate timeline
export const useCandidateTimeline = (candidateId) => {
  return useQuery({
    queryKey: ['candidates', candidateId, 'timeline'],
    queryFn: () => apiService.request(`/candidates/${candidateId}/timeline`),
    enabled: !!candidateId,
  });
};

// Hook to create a new candidate
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (candidateData) => {
      return apiService.request('/candidates', {
        method: 'POST',
        body: JSON.stringify(candidateData),
      });
    },
    onSuccess: (newCandidate) => {
      // Invalidate and refetch candidates list
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success(`Candidate ${newCandidate.name} created successfully!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create candidate');
    },
  });
};

// Hook to update a candidate
export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }) => {
      return apiService.request(`/candidates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: (updatedCandidate) => {
      // Update the candidate in the cache
      queryClient.setQueryData(['candidates', updatedCandidate.id], updatedCandidate);
      
      // Invalidate candidates list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['candidates', 'stats'] });
      
      toast.success(`Candidate ${updatedCandidate.name} updated successfully!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update candidate');
    },
  });
};

// Hook to delete a candidate
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => {
      return apiService.request(`/candidates/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, deletedId) => {
      // Remove the candidate from the cache
      queryClient.removeQueries({ queryKey: ['candidates', deletedId] });
      
      // Invalidate candidates list
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['candidates', 'stats'] });
      
      toast.success('Candidate deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete candidate');
    },
  });
};

// Hook to bulk update candidates
export const useBulkUpdateCandidates = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ candidateIds, updates }) => {
      return apiService.request('/candidates/bulk', {
        method: 'PATCH',
        body: JSON.stringify({ candidateIds, updates }),
      });
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      // Invalidate all candidate-related queries
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      
      if (failureCount === 0) {
        toast.success(`${successCount} candidates updated successfully!`);
      } else {
        toast.success(`${successCount} candidates updated, ${failureCount} failed`);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update candidates');
    },
  });
};

// Hook for moving candidate to next stage
export const useMoveToNextStage = () => {
  const updateCandidate = useUpdateCandidate();
  
  const stageOrder = ['Applied', 'Screening', 'Technical', 'Interview', 'Final', 'Offer', 'Hired'];
  
  return useMutation({
    mutationFn: ({ candidateId, currentStage, notes }) => {
      const currentIndex = stageOrder.indexOf(currentStage);
      const nextStage = stageOrder[currentIndex + 1];
      
      if (!nextStage) {
        throw new Error('Candidate is already at the final stage');
      }
      
      return updateCandidate.mutateAsync({
        id: candidateId,
        updates: {
          stage: nextStage,
          stageChangeNotes: notes || `Moved from ${currentStage} to ${nextStage}`,
        },
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to move candidate to next stage');
    },
  });
};

// Hook for rejecting a candidate
export const useRejectCandidate = () => {
  const updateCandidate = useUpdateCandidate();
  
  return useMutation({
    mutationFn: ({ candidateId, reason }) => {
      return updateCandidate.mutateAsync({
        id: candidateId,
        updates: {
          stage: 'Rejected',
          status: 'Inactive',
          stageChangeNotes: reason || 'Candidate rejected',
        },
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject candidate');
    },
  });
};