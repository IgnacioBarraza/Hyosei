import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../core/models/projects';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Form } from '../../../core/models/forms';
import { TabsModule } from 'primeng/tabs';
import { Subject, takeUntil } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { ProjectService } from '../../../core/services/project.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { EvaluationPayload } from '../../../core/models/evaluations';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-detail',
  imports: [
    BadgeModule,
    ButtonModule,
    CardModule,
    TabsModule,
    SelectButtonModule,
    TextareaModule,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  project!: Project;
  form!: Form;
  userCanEvaluate: boolean = false;
  sendedEvaluation: boolean = false;
  selectedRatings: Record<string, number> = {};
  isSubmitting: boolean = false;
  apiKey: string = '';
  eventId: string = '';
  comment: string = '';
  user!: User;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private event: EventService,
    private notifier: NotificationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.apiKey = this.event.getApiKey();
    this.eventId = this.event.getEventId();
    const projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) return;

    const user = this.auth.getUser();
    if (user) {
      this.user = user;
    }
    if (!this.user?.id) {
      console.error('Usuario no autenticado.');
    }

    this.projectService
      .getProjectById$(projectId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (project) => {
          this.project = project;

          this.projectService
            .hasEvaluatedProject(this.user.id, project.id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe({
              next: (evaluated) => {
                this.userCanEvaluate = !evaluated;
                if (evaluated) {
                  this.sendedEvaluation = true;
                }
              },
              error: (err) => {
                console.error('Error al verificar evaluación:', err);
              },
            });
        },
        error: (err) => {
          console.error('Error al obtener el proyecto:', err);
        },
      });

    this.event.forms$.pipe(takeUntil(this.onDestroy$)).subscribe((forms) => {
      this.form = forms[0];
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleRatingChange(questionId: string, value: number) {
    this.selectedRatings[questionId] = value;
  }

  submitEvaluation() {
    const user = this.auth.getUser();
    if (!user) {
      this.notifier.showWarn(
        'Debes iniciar sesión o registrarte para evaluar este proyecto.'
      );
      return;
    }
    const ratings = this.selectedRatings;
    const comment = this.comment;

    // Validación básica (opcional)
    if (Object.keys(ratings).length !== this.form.questions.length) {
      this.notifier.showWarn(
        'Por favor, califica todas las preguntas antes de enviar la evaluación.'
      );
      return;
    }

    this.isSubmitting = true;

    const totalWeighted = this.form.questions.reduce((acc, q) => {
      const score = ratings[q.id] || 0;
      return acc + score * q.weight;
    }, 0);

    const totalWeight = this.form.questions.reduce(
      (acc, q) => acc + q.weight,
      0
    );
    const finalScore =
      totalWeight > 0 ? Number((totalWeighted / totalWeight).toFixed(1)) : 0;

    const evaluationPayload: EvaluationPayload = {
      form_id: this.form.id,
      project_id: this.project.id,
      final_score: finalScore,
      comment: comment,
      answers: this.form.questions.map((q) => ({
        question_id: q.id,
        score: ratings[q.id],
      })),
    };

    this.projectService.submitEvaluation(evaluationPayload).subscribe({
      next: () => {
        this.sendedEvaluation = true;
        this.notifier.showSuccess('Evaluación enviada con éxito.');
      },
      error: (err) => {
        console.error(err);
        this.notifier.showError('Error al enviar la evaluación.');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
