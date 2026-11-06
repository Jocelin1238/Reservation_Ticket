import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-staff',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar-staff.component.html',
  styleUrl: './sidebar-staff.component.css'
})
export class SidebarStaffComponent {

  constructor(
    private router: Router
  ) {}

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);

  }

}