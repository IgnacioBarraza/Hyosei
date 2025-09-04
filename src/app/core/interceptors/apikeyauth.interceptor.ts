import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';

export const ApikeyAuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const event = inject(EventService);
  const injector = inject(Injector);

  const apikey = event.getApiKey?.();
  const url = req.url.toLowerCase();

  let headers = req.headers;

  if (apikey) {
    headers = headers.set('x-api-key', apikey);
  }

  // Inyección lazy para evitar dependencia circular
  if (
    url.includes('/evaluations') ||
    url.includes('/users') ||
    url.includes('/roles')
  ) {
    const auth = injector.get(AuthService);
    const token = auth.getToken?.();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const clonedReq = req.clone({ headers });
  return next(clonedReq);
};
