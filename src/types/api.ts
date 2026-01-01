export interface Video {
  id: number;
  title: string;
  youtube_url: string;
  uploaded_at: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  views?: string;
  category?: string;
}

export interface PDFResource {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
  description?: string;
  pages?: string;
  category?: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  uploaded_at: string;
  read_time?: string;
  author?: string;
  category?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
  avatar?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}