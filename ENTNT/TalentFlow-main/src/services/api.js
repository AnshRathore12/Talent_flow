const API_BASE = '/api';

class ApiService {
  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'API request failed');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Jobs API
  async getJobs(params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    return this.request(`/jobs${searchParams ? `?${searchParams}` : ''}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id, updates) {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidates API
  async getCandidates(params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    return this.request(`/candidates${searchParams ? `?${searchParams}` : ''}`);
  }

  async createCandidate(candidateData) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  }

  async updateCandidate(id, updates) {
    return this.request(`/candidates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getCandidateTimeline(id) {
    return this.request(`/candidates/${id}/timeline`);
  }

  // Assessments API
  async getAssessment(jobId) {
    return this.request(`/assessments/${jobId}`);
  }

  async saveAssessment(jobId, assessmentData) {
    return this.request(`/assessments/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    });
  }

  async submitAssessment(jobId, responseData) {
    return this.request(`/assessments/${jobId}/submit`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }
}

export default new ApiService();
