import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,

  imports: [
    RouterModule
  ],

  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.css'
})
export class SidebarUserComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // =========================================
  // DECONNEXION
  // =========================================

  logout(): void {

    console.log('🚪 Déconnexion utilisateur');

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}