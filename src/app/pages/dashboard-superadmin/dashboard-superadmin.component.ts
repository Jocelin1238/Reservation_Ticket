import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ReservationChartComponent } from '../../components/reservation-chart/reservation-chart.component';
import { RevenueChartComponent } from '../../components/revenue-chart/revenue-chart.component';
import { RecentTripsComponent } from '../../components/recent-trips/recent-trips.component';
import { RecentBookingsComponent } from '../../components/recent-bookings/recent-bookings.component';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats';
import { CommonModule } from '@angular/common';
import { DashboardReservation } from '../../models/dashboard-reservation';
import { Utilisateur } from '../../models/utilisateur';
import { RevenueStats } from '../../models/revenue-stats';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector:'app-dashboard-superadmin',
  standalone:true,
  imports:[
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    RouterOutlet,
    StatCardComponent,
    ReservationChartComponent,
    RevenueChartComponent,
    RecentTripsComponent,
    RecentBookingsComponent,
    RouterLink
  ],
  templateUrl:'./dashboard-superadmin.component.html',
  styleUrl:'./dashboard-superadmin.component.css'
})
export class DashboardSuperadminComponent implements OnInit {
reservations: DashboardReservation[] = [];

  stats: DashboardStats = {

    utilisateurs:0,
    administrateurs:0,
    staff:0,
    voyages:0,
    reservations:0,
    revenus:0

  };
  recentUsers: Utilisateur[] = [];

revenusStats: RevenueStats[] = [];
  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ){}



  ngOnInit(): void {


    console.log("Dashboard SuperAdmin démarré");


    this.dashboardService.getStats()
    .subscribe({

      next:(data:DashboardStats)=>{


        console.log(
          "Statistiques reçues : ",
          data
        );


        // copie complète de l'objet
        this.stats = {

          utilisateurs: data.utilisateurs ?? 0,

          administrateurs: data.administrateurs ?? 0,

          staff: data.staff ?? 0,

          voyages: data.voyages ?? 0,

          reservations: data.reservations ?? 0,

          revenus: data.revenus ?? 0

        };


        console.log(
          "UTILISATEURS :",
          this.stats.utilisateurs
        );


        console.log(
          "ADMIN :",
          this.stats.administrateurs
        );


        console.log(
          "STAFF :",
          this.stats.staff
        );


        // force la mise à jour des cartes
        this.cdr.detectChanges();
this.loadRecentUsers();



      },


      error:(error)=>{

        console.error(
          "Erreur récupération stats : ",
          error
        );

      }


    });
this.dashboardService.getRecentReservations()

.subscribe({

next:(data)=>{


 this.reservations = data;


 console.log(
 "Dernières réservations :",
 data
 );


},


error:(error)=>{


 console.error(error);


}


});

  }
  
loadRecentUsers(): void {

  console.log(
    'AVANT APPEL recentUsers =',
    this.recentUsers
  );

  this.dashboardService.getRecentUsers().subscribe({

    next: (data: Utilisateur[]) => {

      console.log(
        'DATA RECUE =',
        data
      );

      console.log(
        'NOMBRE DATA =',
        data.length
      );


      this.recentUsers = [...data];


      console.log(
        'APRES AFFECTATION recentUsers =',
        this.recentUsers
      );

      console.log(
        'NOMBRE recentUsers =',
        this.recentUsers.length
      );


      // Mise à jour de la vue Angular
      this.cdr.detectChanges();

    },

    error: (err) => {

      console.error(
        'ERREUR GET RECENT USERS =',
        err
      );

    }

  });
this.dashboardService.getRevenueStats().subscribe({

  next: (data: RevenueStats[]) => {

    console.log('Revenus reçus :', data);

    this.revenusStats = data;

  },

  error: (error) => {

    console.error(
      'Erreur récupération revenus :',
      error
    );

  }

});
}


}