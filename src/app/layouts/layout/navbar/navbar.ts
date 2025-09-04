import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { Popover, PopoverModule } from 'primeng/popover';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { User } from '../../../core/models/user';
import { NavigatorService } from '../../../core/services/navigator.service';

type NavItem = {
  name: string;
  href: () => void;
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

  constructor(
    private eventService: EventService,
    private auth: AuthService,
    private navigation: NavigatorService
  ) {
    this.apiKey = this.eventService.getApiKey();
    this.eventId = this.eventService.getEventId();
    this.navItems = [
      {
        name: 'Inicio',
        href: () => this.navigation.navigateToHome(),
        icon: 'pi-home',
      },
      {
        name: 'Proyectos',
        href: () => this.navigation.navigateToProjects(),
        icon: 'pi-trophy',
      },
      {
        name: 'Evaluados',
        href: () => this.navigation.navigateToEvaluated(),
        icon: 'pi-clipboard',
      },
      {
        name: 'Asignaturas',
        href: () => this.navigation.navigateToCategories(),
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

  navigateToLogin() {
    this.navigation.navigateToLogin();
  }
}
