import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Evaluate } from './features/evaluate/evaluate';
import { authGuard } from './core/guards/auth.guard';
import { Evaluated } from './features/evaluated/evaluated';
import { Admin } from './features/admin/admin';
import { Home } from './features/home/home';
import { Projects } from './features/projects/projects';
import { Auth } from './features/auth/auth';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { Detail } from './features/projects/detail/detail';
import { ProjectLayout } from './core/project-layout/project-layout';

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
        component: ProjectLayout,
        children: [
          {
            path: '',
            component: Projects,
          },
          {
            path: ':id',
            component: Detail,
            // canActivate: [authGuard],
          },
        ],
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
      {
        path: 'auth',
        component: Auth,
        children: [
          {
            path: 'login',
            component: Login,
          },
          {
            path: 'signup',
            component: Signup,
          },
        ],
      },
    ],
  },
];
