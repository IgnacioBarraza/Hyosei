import { Component } from '@angular/core';
import { HeroSection } from './components/hero-section/hero-section';
import { ScheduleSection } from './components/schedule-section/schedule-section';

@Component({
  selector: 'app-home',
  imports: [HeroSection, ScheduleSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
