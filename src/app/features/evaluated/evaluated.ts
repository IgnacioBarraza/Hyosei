import { Component, OnDestroy, OnInit } from '@angular/core';
import { Evaluation } from '../../core/models/evaluations';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';
import { EventService } from '../../core/services/event.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-evaluated',
  imports: [CardModule, BadgeModule],
  templateUrl: './evaluated.html',
  styleUrl: './evaluated.css',
})
export class Evaluated implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  evaluatedProjects: Evaluation[] = [];
  user!: User;
  eventId: string = '';

  constructor(
    private projectService: ProjectService,
    private auth: AuthService,
    private event: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = this.event.getEventId();
    const user = this.auth.getUser();
    if (user) {
      this.user = user;
    }
    if (!this.user?.id) {
      console.error('Usuario no autenticado.');
      this.evaluatedProjects = [];
    }
    this.projectService
      .getEvaluatedProjectsByUser(this.user.id, this.eventId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.evaluatedProjects = data;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
