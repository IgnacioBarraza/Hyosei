import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-page-loader',
  imports: [ProgressSpinnerModule],
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.css',
})
export class PageLoader implements OnInit, OnDestroy {
  @Input() isLoading = true;

  progress = 0;
  currentTip = 0;

  private progressInterval!: ReturnType<typeof setInterval>;
  private tipInterval!: ReturnType<typeof setInterval>;

  loadingTips = [
    { icon: 'pi pi-users', text: 'Cargando proyectos innovadores...' },
    { icon: 'pi pi-trophy', text: 'Preparando las evaluaciones...' },
    { icon: 'pi pi-lightbulb', text: 'Organizando las categorías...' },
    { icon: 'pi pi-calendar', text: 'Sincronizando el cronograma...' },
  ];

  ngOnInit() {
    if (!this.isLoading) return;

    this.progressInterval = setInterval(() => {
      this.progress = Math.min(this.progress + Math.random() * 15, 100);
    }, 200);

    this.tipInterval = setInterval(() => {
      this.currentTip = (this.currentTip + 1) % this.loadingTips.length;
    }, 1500);
  }

  ngOnDestroy() {
    clearInterval(this.progressInterval);
    clearInterval(this.tipInterval);
  }

  get roundedProgress(): number {
    return Math.min(Math.round(this.progress), 100);
  }

  get progressWidth(): number {
    return Math.min(this.progress, 100);
  }
}
