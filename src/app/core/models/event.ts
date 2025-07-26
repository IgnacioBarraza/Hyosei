import { Category } from './category';
import { Client } from './client';
import { Form } from './forms';
import { Project } from './projects';

export interface EventData {
  id: string;
  name: string;
  sub_title: string;
  description: string;
  date_start: string;
  date_end: string;
  location: string;
  banner_url: string;
  client: Client;
  created_at: string;
  updated_at: string;
  projects: Project[];
  categories: Category[];
  forms: Form[];
  // reviewers?: [];
  // attendance_sessions?: [];
}
