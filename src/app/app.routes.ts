import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'about-me',
    loadComponent: () => import('./features/about-me/about-me.component').then(m => m.AboutMeComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience.component').then(m => m.ExperienceComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
