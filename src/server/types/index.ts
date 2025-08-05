export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AppVersion {
  id: string;
  project_id: string;
  version_number: number;
  html_content?: string;
  css_content?: string;
  js_content?: string;
  created_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface ChatRequest {
  project_id: string;
  message: string;
}

export interface ChatResponse {
  message: ChatMessage;
  generated_app?: {
    html: string;
    css: string;
    js: string;
  };
}

export interface PreviewRequest {
  project_id: string;
  html?: string;
  css?: string;
  js?: string;
}

export interface WebSocketMessage {
  type: 'chat_message' | 'app_update' | 'project_update' | 'error';
  data: any;
  project_id?: string;
}

export interface AIResponse {
  message: string;
  app_code?: {
    html: string;
    css: string;
    js: string;
  };
} 