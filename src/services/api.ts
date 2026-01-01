export interface Video {
  id: number;
  title: string;
  youtube_url: string;
  uploaded_at: string;
  description?: string;
  duration?: string;
  category?: string;
  thumbnail_url?: string;
  embed_url?: string;
}

export interface PDFResource {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
  description?: string;
  pages?: string;
  category?: string;
  file_size?: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  uploaded_at: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = {
  getVideos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  getParentVideos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parent-videos/`);
      const data = await response.json();
      console.log('Parent videos loaded:', data.results);
      return data.results || [];
    } catch (error) {
      console.error('Error fetching parent videos:', error);
      return [];
    }
  },

  getArticles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      return [];
    }
  },

  getParentArticles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parent-articles/`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      return [];
    }
  },

  getPDFs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pdfs/`);
      const data = await response.json();
      console.log('PDFs loaded:', data.results);
      return data.results || [];
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      return [];
    }
  },

  getCareerQuizzes: async () => [],
  login: async (credentials: any) => ({ user: { name: 'Demo User' } }),
  logout: async () => {},
  updateProfile: async (userData: any) => {
    // Simulate API call
    console.log('Updating profile:', userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userData);
      }, 500);
    });
  }
};

export default api;