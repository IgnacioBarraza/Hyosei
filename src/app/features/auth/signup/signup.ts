import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EventBasic } from '../../../core/models/event';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    Toast,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  providers: [MessageService],
})
export class Signup implements OnInit {
  private onDestroy$ = new Subject<void>();
  signUp!: FormGroup;
  apiKey: string;
  eventId: string;
  event!: EventBasic;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private eventService: EventService,
    private messageService: MessageService,
    private router: Router
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

    this.signUp = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[0-9kK]$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.signUp.invalid) {
      this.signUp.markAllAsTouched();

      const controls = this.signUp.controls;

      if (controls['rut'].errors?.['pattern']) {
        this.showError('Formato de RUT inválido. Ej: 12345678-9');
      } else if (controls['name'].errors?.['minlength']) {
        this.showError('El nombre debe tener al menos 3 caracteres.');
      } else if (controls['password'].errors?.['minlength']) {
        this.showError('La contraseña debe tener al menos 8 caracteres.');
      } else {
        this.showError('Completa todos los campos correctamente.');
      }
      return;
    }

    const { name, rut, password, confirmPassword } = this.signUp.value;

    if (password !== confirmPassword) {
      this.showError('Las contraseñas no coinciden.');
      return;
    }

    this.auth
      .signup(name, rut, password)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => {
          this.auth.handleAuthToken(res.token);
          this.showSuccess('Registro exitoso. Redirigiendo...');
          this.router.navigate([`/${this.apiKey}/event/${this.eventId}`]);
        },
        error: (err) => {
          const detail =
            err?.error?.message || 'Ocurrió un error al registrarse.';
          this.showError(detail);
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

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
    });
  }

  showError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
    });
  }
}
