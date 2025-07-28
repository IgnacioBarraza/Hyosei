import { Form } from './forms';
import { Project } from './projects';
import { User } from './user';

export interface EvaluationPayload {
  form_id: string;
  project_id: string;
  answers: {
    question_id: string;
    score: number;
  }[];
  comment: string;
  final_score: number;
}

export interface Evaluation {
  id: string;
  project: Project;
  evaluator: Partial<User>;
  form: Partial<Form>;
  final_score: number;
  comment: string;
  created_at: string;
}
