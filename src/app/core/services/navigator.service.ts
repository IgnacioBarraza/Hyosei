import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  constructor(private router: Router, private eventService: EventService) {}

  private navigateTo(route: string, params?: Record<string, any>) {
    const apiKey = this.eventService.getApiKey();
    const eventId = this.eventService.getEventId();

    if (!apiKey || !eventId) {
      console.error('No apiKey or eventId available!');
      return;
    }

    const url = `/${apiKey}/event/${eventId}/${route}`;

    if (params) {
      this.router.navigate([url], { queryParams: params });
    } else {
      this.router.navigate([url]);
    }
  }

  navigateToHome() {
    this.navigateTo('');
  }

  navigateToLogin() {
    this.navigateTo('auth/login');
  }

  navigateToSignup() {
    this.navigateTo('auth/signup');
  }

  navigateToProjects(params?: string) {
    this.navigateTo('proyectos', params ? { categoria: params } : undefined);
  }

  navigateToProjectDetail(id: string) {
    this.navigateTo(`proyectos/${id}`);
  }

  navigateToEvaluated() {
    this.navigateTo('evaluados');
  }

  navigateToCategories() {
    this.navigateTo('categorias');
  }
}
