import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterOutlet
} from '@angular/router';

import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';

import { TopbarComponent }
  from '../../components/topbar/topbar.component';

import { StatCardComponent }
  from '../../components/stat-card/stat-card.component';

import { ReservationChartComponent }
  from '../../components/reservation-chart/reservation-chart.component';

import { RevenueChartComponent }
  from '../../components/revenue-chart/revenue-chart.component';

import { RecentTripsComponent }
  from '../../components/recent-trips/recent-trips.component';

import { RecentBookingsComponent }
  from '../../components/recent-bookings/recent-bookings.component';

import { DashboardService }
  from '../../services/dashboard.service';

import { DashboardStats }
  from '../../models/dashboard-stats';

import { DashboardReservation }
  from '../../models/dashboard-reservation';

import { Utilisateur }
  from '../../models/utilisateur';

import { RevenueStats }
  from '../../models/revenue-stats';


@Component({
  selector: 'app-dashboard-admin',

  standalone: true,

  imports: [

    CommonModule,

    RouterLink,

    RouterOutlet,

    SidebarAdminComponent,

    TopbarComponent,

    StatCardComponent,

    ReservationChartComponent,

    RevenueChartComponent,

    RecentTripsComponent,

    RecentBookingsComponent

  ],

  templateUrl: './dashboard-admin.component.html',

  styleUrl: './dashboard-admin.component.css'
})


export class DashboardAdminComponent
  implements OnInit {


  // =====================================================
  // DONNÉES
  // =====================================================

  reservations: DashboardReservation[] = [];

  recentUsers: Utilisateur[] = [];

  revenusStats: RevenueStats[] = [];


  // =====================================================
  // STATISTIQUES
  // =====================================================

  stats: DashboardStats = {

    utilisateurs: 0,

    administrateurs: 0,

    staff: 0,

    voyages: 0,

    reservations: 0,

    revenus: 0

  };


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(

    private dashboardService: DashboardService,

    private cdr: ChangeDetectorRef

  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    console.log(
      '🟢 Dashboard Admin démarré'
    );


    this.chargerStatistiques();

    this.chargerReservations();

    this.chargerUtilisateurs();

    this.chargerRevenus();

  }


  // =====================================================
  // STATISTIQUES
  // =====================================================

  chargerStatistiques(): void {

    this.dashboardService
      .getStats()
      .subscribe({

        next: (data: DashboardStats) => {

          console.log(
            '📊 Statistiques Admin :',
            data
          );


          this.stats = {

            utilisateurs:
              data.utilisateurs ?? 0,

            administrateurs:
              data.administrateurs ?? 0,

            staff:
              data.staff ?? 0,

            voyages:
              data.voyages ?? 0,

            reservations:
              data.reservations ?? 0,

            revenus:
              data.revenus ?? 0

          };


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            '❌ Erreur statistiques Admin :',
            error
          );

        }

      });

  }


  // =====================================================
  // DERNIÈRES RÉSERVATIONS
  // =====================================================

  chargerReservations(): void {

    this.dashboardService
      .getRecentReservations()
      .subscribe({

        next: (data) => {

          console.log(
            '🎫 Réservations Admin :',
            data
          );

          this.reservations = data;

        },


        error: (error) => {

          console.error(
            '❌ Erreur réservations :',
            error
          );

        }

      });

  }


  // =====================================================
  // DERNIERS UTILISATEURS
  // =====================================================

  chargerUtilisateurs(): void {

    this.dashboardService
      .getRecentUsers()
      .subscribe({

        next: (data: Utilisateur[]) => {

          console.log(
            '👥 Utilisateurs Admin :',
            data
          );

          this.recentUsers = [...data];

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            '❌ Erreur utilisateurs :',
            error
          );

        }

      });

  }


  // =====================================================
  // REVENUS
  // =====================================================

  chargerRevenus(): void {

    this.dashboardService
      .getRevenueStats()
      .subscribe({

        next: (data: RevenueStats[]) => {

          console.log(
            '💰 Revenus Admin :',
            data
          );

          this.revenusStats = data;

        },


        error: (error) => {

          console.error(
            '❌ Erreur revenus :',
            error
          );

        }

      });

  }

}