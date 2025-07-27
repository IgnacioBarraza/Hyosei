import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { EventService } from '../../core/services/event.service';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../core/models/category';
import { FormsModule } from '@angular/forms';
import { Project } from '../../core/models/projects';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [
    SelectModule,
    FormsModule,
    CardModule,
    BadgeModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    RouterLink,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private allProjects: Project[] = [];

  categories: Category[] = [];
  selectedCategory: Category | undefined;
  sortedProjects: Project[] = [];
  searchTerm: string = '';
  apiKey: string = '';
  eventId: string = '';
  expoName: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.apiKey = this.eventService.getApiKey();
    this.eventId = this.eventService.getEventId();
    this.eventService.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((categories) => (this.categories = categories));

    this.eventService.projects$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((projects) => {
        this.allProjects = projects;
        this.filterProjects();
      });
  }

  filterProjects() {
    const term = this.searchTerm.toLowerCase().trim();
    const category = this.selectedCategory;

    this.sortedProjects = this.allProjects.filter((project) => {
      const matchesCategory = !category || project.category.id === category.id;
      const matchesSearch = !term || project.title.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
