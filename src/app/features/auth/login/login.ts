import { Component, OnInit } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventBasic } from '../../../core/models/event';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private onDestroy$ = new Subject<void>();
  loginForm!: FormGroup;
  apiKey: string;
  eventId: string;
  event!: EventBasic;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private eventService: EventService
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
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.auth.login(formData.rut, formData.password);
    } else {
      this.loginForm.markAllAsTouched();
    }
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
}
