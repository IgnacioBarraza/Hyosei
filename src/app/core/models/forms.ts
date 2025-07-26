import { Question } from './questions';

export interface Form {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}
