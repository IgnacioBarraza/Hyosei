import { Injectable, isDevMode } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  interval,
  map,
  of,
  Subscription,
} from 'rxjs';
import { EventData } from '../models/event';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly backend_url: string = isDevMode()
    ? 'http://localhost:5000/api/events'
    : 'https://api-hyosei.up.railway.app/api/events';
  private apiKey: string = '';
  private eventId: string = '';
  private refreshSubscription: Subscription | null = null;

  private eventSubject = new BehaviorSubject<EventData>({} as EventData);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public event$ = this.eventSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  init(apiKey: string, eventId: string): void {
    this.apiKey = apiKey;
    this.eventId = eventId;
    this.fetchEvent();
    // this.startAutoRefresh();
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

  private startAutoRefresh(): void {
    console.log('refresh');
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    this.refreshSubscription = interval(60000) // cada 60 segundos
      .subscribe(() => this.fetchEvent(true));
  }

  stopAutoRefresh(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = null;
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

  public eventBasic$ = this.event$.pipe(
    map((event) => ({
      name: event.name,
      sub_title: event.sub_title,
      description: event.description,
      date_start: event.date_start,
      date_end: event.date_end,
      location: event.location,
      banner_url: event.banner_url,
    }))
  );

  // Observable para solo projects
  public projects$ = this.event$.pipe(map((event) => event.projects ?? []));

  // Observable para solo categories
  public categories$ = this.event$.pipe(map((event) => event.categories ?? []));

  // Observable para solo forms
  public forms$ = this.event$.pipe(map((event) => event.forms ?? []));

  // Observable para solo client
  public client$ = this.event$.pipe(map((event) => event.client ?? null));
}
