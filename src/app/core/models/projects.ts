import { Category } from './category';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  image_url: string;
  members: ProjectMember[];
  evaluations: [];
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  full_name: string;
}
