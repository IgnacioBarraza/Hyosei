import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../core/models/category';
import { CardModule } from 'primeng/card';
import { EventService } from '../../core/services/event.service';
import { Subject, takeUntil } from 'rxjs';
import { Project } from '../../core/models/projects';
import { enrichCategoriesWithCountAndColor } from '../../utils/utils';
import { NavigatorService } from '../../core/services/navigator.service';

@Component({
  selector: 'app-category',
  imports: [CardModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Categories implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private projects: Project[] = [];
  categories: Category[] = [];
  expoName: string = '';
  apiKey: string = '';
  eventId: string = '';

  constructor(
    private event: EventService,
    private navigation: NavigatorService
  ) {}

  ngOnInit(): void {
    this.apiKey = this.event.getApiKey();
    this.eventId = this.event.getEventId();
    this.event.projects$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((projects) => {
        this.projects = projects;
      });

    this.event.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((categories) => {
        this.categories = this.formatCategories(categories, this.projects);
      });

    this.event.eventBasic$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event) => {
        this.expoName = event.name;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  formatCategories(categories: Category[], projects: Project[]): Category[] {
    return enrichCategoriesWithCountAndColor(categories, projects);
  }

  navigateToProjects(category: string) {
    this.navigation.navigateToProjects(category);
  }
}
