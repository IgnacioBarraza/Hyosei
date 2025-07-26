import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EventService } from '../../services/event.service';

type NavItem = {
  name: string;
  href: string;
};

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  apiKey: string = '';
  eventId: string = '';

  navItems: NavItem[] = [];

  isLoggedIn = false;

  constructor(private eventService: EventService) {
    this.apiKey = this.eventService.getApiKey();
    this.eventId = this.eventService.getEventId();
    this.navItems = [
      { name: 'Inicio', href: `/${this.apiKey}/event/${this.eventId}` },
      {
        name: 'Proyectos',
        href: `/${this.apiKey}/event/${this.eventId}/proyectos`,
      },
      {
        name: 'Evaluados',
        href: `/${this.apiKey}/event/${this.eventId}/evaluados`,
      },
      {
        name: 'Categorías',
        href: `/${this.apiKey}/event/${this.eventId}/categorias`,
      },
    ];
  }
}
