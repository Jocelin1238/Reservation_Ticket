
import { Component, OnInit } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { TopbarEventService } from '../../services/topbar-event.service';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],

  templateUrl: './sidebar.component.html',

  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  // =====================================================
  // ROLE UTILISATEUR
  // =====================================================

  roleUtilisateur = '';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private router: Router,
    private topbarEventService: TopbarEventService,
    private authService: AuthService
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.roleUtilisateur =
      this.authService.getUserRole();

    console.log(
      '👤 Rôle Sidebar :',
      this.roleUtilisateur
    );

  }


  // =====================================================
  // ROLE AFFICHÉ
  // =====================================================

  get roleAffiche(): string {

    switch (this.roleUtilisateur) {

      case 'ROLE_SUPER_ADMIN':
        return 'Super Admin';

      case 'ROLE_ADMIN':
        return 'Administrateur';

      case 'ROLE_STAFF':
        return 'Staff';

      case 'ROLE_USER':
        return 'Utilisateur';

      default:
        return 'Utilisateur';

    }

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  ouvrirNotifications(): void {

    console.log(
      '🟢 CLIC NOTIFICATION SIDEBAR'
    );

    this.topbarEventService.ouvrirNotifications();

  }


  // =====================================================
  // DECONNEXION
  // =====================================================

  logout(): void {

    console.log(
      'Déconnexion...'
    );

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate(['/login']);

  }

}

