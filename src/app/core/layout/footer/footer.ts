import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subject, takeUntil } from 'rxjs';

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
