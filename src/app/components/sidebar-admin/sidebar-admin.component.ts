
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {

  constructor(
    private router: Router
  ) {}

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);

  }

}

