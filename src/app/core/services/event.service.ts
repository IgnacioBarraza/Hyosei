import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { EventData } from '../models/event';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiKey: string = '';
  private eventId: string = '';
  private backend_url: string = 'https://api-hyosei.up.railway.app/api/events';

  private eventSubject = new BehaviorSubject<EventData>({} as EventData);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public event$ = this.eventSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  init(apiKey: string, eventId: string): void {
    this.apiKey = apiKey;
    this.eventId = eventId;
    this.fetchEvent();
  }

  getEvent(): EventData {
    return this.eventSubject.value;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getEventId(): string {
    return this.eventId;
  }

  refresh(): void {
    this.fetchEvent(true);
  }

  private fetchEvent(forceReload = false): void {
    if (!this.apiKey || !this.eventId) return;

    const cacheKey = `event_${this.eventId}`;

    if (!forceReload) {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        this.eventSubject.next(JSON.parse(stored));
        this.loadingSubject.next(false);
        return;
      }
    }

    this.loadingSubject.next(true);

    const headers = new HttpHeaders({
      'x-api-key': this.apiKey,
    });

    this.http
      .get<EventData>(`${this.backend_url}/${this.eventId}`, { headers })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar el evento:', err);
          this.loadingSubject.next(false);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          this.eventSubject.next(data);
        }
        this.loadingSubject.next(false);
      });
  }
}
