import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';
import { Category } from '../../../../core/models/category';
import { EventService } from '../../../../core/services/event.service';
import { NavigatorService } from '../../../../core/services/navigator.service';

@Component({
  selector: 'app-categories-section',
  imports: [ButtonModule, BadgeModule, OverlayBadgeModule, CardModule],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection {
  @Input() categories!: Category[];

  projectUrl: string;

  constructor(
    private eventService: EventService,
    private navigation: NavigatorService
  ) {
    const apiKey = this.eventService.getApiKey();
    const eventId = this.eventService.getEventId();

    this.projectUrl = `/${apiKey}/event/${eventId}/proyectos`;
  }

  navigateToProjects(param: string) {
    this.navigation.navigateToProjects(param);
  }

  navigateToCategories() {
    this.navigation.navigateToCategories();
  }
}
