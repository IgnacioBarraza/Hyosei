import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private onDestroy$ = new Subject<void>();
  contact_email!: string;
  currentYear: number = new Date().getFullYear();

  constructor(private eventService: EventService) {
    this.eventService.client$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((client) => {
        this.contact_email = client.contact_email;
      });
  }

  ngOnInit(): void {}
}
