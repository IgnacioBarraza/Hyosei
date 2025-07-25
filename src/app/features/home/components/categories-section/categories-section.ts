import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-categories-section',
  imports: [ButtonModule, BadgeModule, OverlayBadgeModule, CardModule],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection {
  categories = [
    {
      id: 1,
      nombre: 'Innovación Tecnológica',
      descripcion:
        'Explora proyectos que presentan soluciones tecnológicas innovadoras para resolver problemas actuales y futuros.',
      color: 'bg-purple-500',
      proyectos: 12,
    },
    {
      id: 2,
      nombre: 'Desarrollo Sostenible',
      descripcion:
        'Descubre iniciativas enfocadas en la sostenibilidad ambiental y el desarrollo responsable de tecnologías verdes.',
      color: 'bg-green-500',
      proyectos: 8,
    },
    {
      id: 3,
      nombre: 'Aplicaciones Móviles',
      descripcion:
        'Conoce aplicaciones móviles innovadoras que resuelven necesidades específicas de usuarios y comunidades.',
      color: 'bg-blue-500',
      proyectos: 15,
    },
    {
      id: 4,
      nombre: 'Inteligencia Artificial',
      descripcion:
        'Aprende sobre proyectos que implementan algoritmos de IA y machine learning para automatizar procesos complejos.',
      color: 'bg-orange-500',
      proyectos: 10,
    },
    {
      id: 5,
      nombre: 'Investigación Científica',
      descripcion:
        'Explora investigaciones en diversas áreas científicas con resultados significativos y aplicaciones prácticas.',
      color: 'bg-red-500',
      proyectos: 7,
    },
    {
      id: 6,
      nombre: 'Emprendimiento',
      descripcion:
        'Descubre proyectos con potencial emprendedor que buscan convertirse en soluciones comerciales viables.',
      color: 'bg-indigo-500',
      proyectos: 9,
    },
  ];
}
