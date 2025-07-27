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

  // No agregar headers en endpoints de /users o /roles
  if (url.includes('/users') || url.includes('/roles')) {
    return next(req);
  }

  let headers = req.headers;

  if (apikey) {
    headers = headers.set('x-api-key', apikey);
  }

  // Solo agregar token en evaluaciones - inyección lazy para evitar dependencia circular
  if (url.includes('/evaluations')) {
    const auth = injector.get(AuthService);
    const token = auth.getToken?.();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const clonedReq = req.clone({ headers });
  return next(clonedReq);
};
