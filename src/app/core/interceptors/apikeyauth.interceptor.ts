import { HttpInterceptorFn } from '@angular/common/http';
import { Inject } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';

export const apikeyauthInterceptor: HttpInterceptorFn = (req, next) => {
  const event = Inject(EventService);
  const auth = Inject(AuthService);

  const apikey = event.getApiKey();
  const token = auth.getToken();

  const url = req.url.toLowerCase();

  if (url.includes('/users') || url.includes('/roles')) return next(req);

  let headers = req.headers;

  if (apikey) {
    headers = headers.set('x-api-key', apikey);
  }

  // Solo para evaluaciones añadir Authorization Bearer
  if (token && url.includes('/evaluations')) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloned = req.clone({ headers });
  return next(cloned);
};
