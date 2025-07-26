import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroSection } from './components/hero-section/hero-section';
import { ScheduleSection } from './components/schedule-section/schedule-section';
import { CategoriesSection } from './components/categories-section/categories-section';
import { EventService } from '../../core/services/event.service';
import { Subject, takeUntil } from 'rxjs';
import { EventBasic } from '../../core/models/event';
import { Category } from '../../core/models/category';

@Component({
  selector: 'app-home',
  imports: [HeroSection, ScheduleSection, CategoriesSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  event!: EventBasic;
  categories!: Category[];
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.eventBasic$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event) => {
        this.event = event;
      });

    this.eventService.categories$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((categories) => {
        console.log(categories);
        this.categories = categories;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
