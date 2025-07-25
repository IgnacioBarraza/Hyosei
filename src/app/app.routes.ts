import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Evaluate } from './features/evaluate/evaluate';
import { authGuard } from './core/guards/auth.guard';
import { Evaluated } from './features/evaluated/evaluated';
import { Admin } from './features/admin/admin';
import { Home } from './features/home/home';
import { Projects } from './features/projects/projects';

export const routes: Routes = [
  {
    path: ':apiKey/event/:eventId',
    component: Layout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'proyectos',
        component: Projects,
      },
      {
        path: 'evaluar',
        component: Evaluate,
        canActivate: [authGuard],
        data: { roles: ['user', 'admin'] },
      },
      {
        path: 'evaluados',
        component: Evaluated,
        canActivate: [authGuard],
        data: { roles: ['user', 'admin'] },
      },
      {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard],
        data: { roles: ['admin'] },
      },
    ],
  },
];
