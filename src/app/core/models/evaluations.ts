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
