import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { EventService } from '../services/event.service';
import { PageLoader } from '../../shared/components/page-loader/page-loader';
import { EventBasic } from '../models/event';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Footer, PageLoader],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  loading: boolean = true;
  error: boolean = false;
  event!: EventBasic;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const apiKey = params.get('apiKey');
      const eventId = params.get('eventId');

      if (apiKey && eventId) {
        this.eventService.init(apiKey, eventId);
      } else {
        console.error('Faltan parámetros apiKey o eventId');
      }
    });

    this.eventService.loading$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.loading = value;
      });

    this.eventService.eventBasic$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.event = data;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
