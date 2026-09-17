
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardVoyage } from '../../models/dashboard-voyage';

@Component({

  selector: 'app-recent-trips',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './recent-trips.component.html',

  styleUrl: './recent-trips.component.css'

})
export class RecentTripsComponent implements OnInit {

  trips: DashboardVoyage[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {

    console.log('Chargement des derniers voyages...');

    this.dashboardService.getRecentVoyages()
      .subscribe({

        next: (data: DashboardVoyage[]) => {

          console.log(
            'Derniers voyages reçus :',
            data
          );

          this.trips = data;

        },

        error: (error) => {

          console.error(
            'Erreur récupération derniers voyages :',
            error
          );

        }

      });

  }

  voirTousLesVoyages(): void {

    this.router.navigate(['/voyages']);

  }

}