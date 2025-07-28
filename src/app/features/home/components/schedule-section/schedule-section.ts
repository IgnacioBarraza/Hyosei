import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-section',
  imports: [TabsModule, CardModule, CommonModule],
  templateUrl: './schedule-section.html',
  styleUrl: './schedule-section.css',
})
export class ScheduleSection {
  cronograma = [
    {
      fecha: '28 de Julio, 2025',
      eventos: [
        {
          hora: '08:30 - 10:30',
          actividad: 'Inauguración de la Expo',
          lugar: 'Salón de Actos',
        },
        {
          hora: '10:30 - 13:15',
          actividad: 'Exposición de Proyectos',
          lugar: 'Salón de Actos',
        },
        {
          hora: '12:30 - 13:00',
          actividad: 'Ballet artistico San Pedro - BASPE',
          lugar: 'Salón de Actos',
        },
        {
          hora: '13:15 - 13:30',
          actividad: 'Actividad Interactiva - DITEC UTA',
          lugar: 'Salón de Actos',
        },
      ],
    },
  ];
}
