import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { EventBasic } from '../../../core/models/event';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { NavigatorService } from '../../../core/services/navigator.service';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  loginForm!: FormGroup;
  apiKey: string;
  eventId: string;
  event!: EventBasic;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private eventService: EventService,
    private notification: NotificationService,
    private navigation: NavigatorService
  ) {
    this.apiKey = this.eventService.getApiKey();
    this.eventId = this.eventService.getEventId();
  }

  ngOnInit(): void {
    this.eventService.eventBasic$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.event = data;
      });

    this.loginForm = this.fb.group({
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[0-9kK]$/)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      const controls = this.loginForm.controls;
      if (controls['rut'].errors?.['pattern']) {
        this.notification.showError('Formato de RUT inválido. Ej: 12345678-9');
      } else if (controls['name'].errors?.['minlength']) {
        this.notification.showError(
          'El nombre debe tener al menos 3 caracteres.'
        );
      } else if (controls['password'].errors?.['minlength']) {
        this.notification.showError(
          'La contraseña debe tener al menos 8 caracteres.'
        );
      } else {
        this.notification.showError('Completa todos los campos correctamente.');
      }
      return;
    }

    const { rut, password } = this.loginForm.value;
    this.auth.login(rut, password).subscribe({
      next: (res) => {
        this.auth.handleAuthToken(res.token);
        this.notification.showSuccess('Inicio de sesión exitoso.');
        this.navigation.navigateToHome();
      },
      error: (err) => {
        const detail =
          err?.error?.message || 'Ocurrió un error al registrarse.';
        this.notification.showError(detail);
      },
    });
  }

  formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });

  isSameDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1).toDateString();
    const d2 = new Date(date2).toDateString();
    return d1 === d2;
  }

  goToSignup() {
    this.navigation.navigateToSignup();
  }
}
