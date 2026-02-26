export type IdeaStatus = 'seed' | 'active' | 'archived';

export interface Category {
  id: string;
  name: string;
  type: 'idea' | 'app';
  color: string;
  created_at: string;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  status: IdeaStatus;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WebApp {
  id: string;
  title: string;
  description: string;
  url: string;
  icon_url: string;
  category_id: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  icon_url?: string;
  type: 'app' | 'idea' | 'action';
  action?: () => void;
}
