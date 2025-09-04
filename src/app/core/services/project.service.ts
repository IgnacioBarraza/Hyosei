import { Injectable, isDevMode } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Project } from '../models/projects';
import { EventService } from './event.service';
import { HttpClient } from '@angular/common/http';
import { Evaluation, EvaluationPayload } from '../models/evaluations';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly apiUrl = isDevMode()
    ? 'http://localhost:5000/api'
    : 'https://api-hyosei.up.railway.app/api';

  constructor(private eventService: EventService, private http: HttpClient) {}

  getAllProjects$(): Observable<Project[]> {
    return this.eventService.projects$;
  }

  getProjectById$(id: string): Observable<Project> {
    return this.eventService.projects$.pipe(
      switchMap((projects) => {
        const found = projects.find((p) => p.id === id);
        if (found) {
          return of(found);
        }

        // fallback a petición HTTP si no se encuentra localmente
        return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
      })
    );
  }

  submitEvaluation(payload: EvaluationPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluations`, payload);
  }

  hasEvaluatedProject(
    user_id: string,
    project_id: string
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/evaluations/user/${user_id}/project/${project_id}`
    );
  }

  getEvaluatedProjectsByUser(
    user_id: string,
    event_id: string
  ): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(
      `${this.apiUrl}/evaluations/user/${user_id}/event/${event_id}`
    );
  }
}
