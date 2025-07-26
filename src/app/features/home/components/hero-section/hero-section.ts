import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EventBasic } from '../../../../core/models/event';
import { EventService } from '../../../../core/services/event.service';

@Component({
  selector: 'app-hero-section',
  imports: [ButtonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  @Input() eventData!: EventBasic;

  projectUrl: string = '';

  constructor(private eventService: EventService) {
    const apiKey = this.eventService.getApiKey();
    const eventId = this.eventService.getEventId();

    this.projectUrl = `/${apiKey}/event/${eventId}/proyectos`;
  }

  formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });

  isSameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1).toDateString();
    const d2 = new Date(date2).toDateString();
    return d1 === d2;
  }
}
