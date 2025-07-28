import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { User } from '../../models/user';
import { Drawer, DrawerModule } from 'primeng/drawer';

type NavItem = {
  name: string;
  href: string;
  icon: string;
};

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, RouterLink, PopoverModule, DrawerModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  private onDestroy$ = new Subject<void>();
  @ViewChild('op') op!: Popover;
  apiKey: string = '';
  eventId: string = '';
  user!: User;

  navItems: NavItem[] = [];
  isLoggedIn = false;
  visible: boolean = false;

  constructor(private eventService: EventService, private auth: AuthService) {
    this.apiKey = this.eventService.getApiKey();
    this.eventId = this.eventService.getEventId();
    this.navItems = [
      {
        name: 'Inicio',
        href: `/${this.apiKey}/event/${this.eventId}`,
        icon: 'pi-home',
      },
      {
        name: 'Proyectos',
        href: `/${this.apiKey}/event/${this.eventId}/proyectos`,
        icon: 'pi-trophy',
      },
      {
        name: 'Evaluados',
        href: `/${this.apiKey}/event/${this.eventId}/evaluados`,
        icon: 'pi-clipboard',
      },
      {
        name: 'Asignaturas',
        href: `/${this.apiKey}/event/${this.eventId}/categorias`,
        icon: 'pi-filter',
      },
    ];
  }

  ngOnInit(): void {
    this.auth.user$.pipe(takeUntil(this.onDestroy$)).subscribe((user) => {
      this.user = user!;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toggle(event: any) {
    this.op.toggle(event);
  }

  logout() {
    this.auth.logout();
  }

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }
}
