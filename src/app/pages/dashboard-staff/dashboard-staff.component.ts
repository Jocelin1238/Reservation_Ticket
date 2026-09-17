
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  StaffDashboardService,
  StaffDashboardDTO,
  StaffVoyageDTO,
  StaffReservationDTO
} from '../../services/staff-dashboard.service';

import { SidebarStaffComponent } from '../../components/sidebar-staff/sidebar-staff.component';
import { TopbarStaffComponent } from '../../components/topbar-staff/topbar-staff.component';


// =====================================================
// INTERFACE DEPART POUR LE HTML
// =====================================================

interface Depart {

  numeroVoyage: string;

  heure: string;

  depart: string;

  destination: string;

  places: number;

  statut: string;

  dateDepart: string;
}


// =====================================================
// INTERFACE RESERVATION POUR LE HTML
// =====================================================

interface Reservation {

  numero: string;

  client: string;

  trajet: string;

  statut: string;

  dateReservation?: string;
}


@Component({

  selector: 'app-dashboard-staff',

  standalone: true,

  imports: [
    CommonModule,
    SidebarStaffComponent,
    TopbarStaffComponent
  ],

  templateUrl: './dashboard-staff.component.html',

  styleUrl: './dashboard-staff.component.css'

})


export class DashboardStaffComponent implements OnInit {


  // =====================================================
  // UTILISATEUR
  // =====================================================

  prenomStaff = 'Staff';


  // =====================================================
  // DATE
  // =====================================================

  dateAujourdHui = '';


  // =====================================================
  // STATISTIQUES
  // =====================================================

  nombreVoyages = 0;

  nombreReservations = 0;

  nombreDeparts = 0;

  ticketsScannes = 0;


  // =====================================================
  // PROCHAINS DEPARTS
  // =====================================================

  prochainsDeparts: Depart[] = [];


  // =====================================================
  // RESERVATIONS RECENTES
  // =====================================================

  reservationsRecentes: Reservation[] = [];


  // =====================================================
  // ETAT
  // =====================================================

  chargement = false;

  erreur = false;


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(

    private router: Router,

    private staffDashboardService: StaffDashboardService

  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.chargerUtilisateur();

    this.chargerDate();

    this.chargerDashboard();

  }


  // =====================================================
  // UTILISATEUR CONNECTE
  // =====================================================

  chargerUtilisateur(): void {

    const user = localStorage.getItem('user');

    if (!user) {
      return;
    }

    try {

      const utilisateur = JSON.parse(user);

      this.prenomStaff =
        utilisateur.prenom ||
        utilisateur.firstName ||
        'Staff';

    } catch (error) {

      console.error(
        '❌ Erreur lecture utilisateur :',
        error
      );

    }

  }


  // =====================================================
  // DATE
  // =====================================================

  chargerDate(): void {

    this.dateAujourdHui =
      new Date().toLocaleDateString(
        'fr-FR',
        {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      );

  }


  // =====================================================
  // CHARGER DASHBOARD
  // =====================================================

  chargerDashboard(): void {

    this.chargement = true;

    this.erreur = false;

    console.log(
      '🔵 Chargement du dashboard Staff...'
    );


    this.staffDashboardService
      .getDashboard()
      .subscribe({

        // =================================================
        // SUCCES
        // =================================================

        next: (
          dashboard: StaffDashboardDTO
        ) => {

          console.log(
            '✅ Dashboard Staff reçu :',
            dashboard
          );


          // ===============================================
          // UTILISATEUR
          // ===============================================

          if (dashboard.prenomStaff) {

            this.prenomStaff =
              dashboard.prenomStaff;

          }


          // ===============================================
          // STATISTIQUES
          // ===============================================

          this.nombreVoyages =
            dashboard.nombreVoyages;

          this.nombreReservations =
            dashboard.nombreReservations;

          this.nombreDeparts =
            dashboard.nombreDeparts;

          this.ticketsScannes =
            dashboard.ticketsScannes;


          // ===============================================
          // PROCHAINS DEPARTS
          // ===============================================

        this.prochainsDeparts =
  (dashboard.prochainsDeparts || [])
    .map(
      (
        voyage: StaffVoyageDTO
      ) => {

        return {

          numeroVoyage:
            voyage.numeroVoyage ||
            `V-${voyage.id || ''}`,

          heure:
            voyage.heureDepart ||
            '--:--',
depart:
  voyage.villeDepart ||
  'Trajet indéfini',

destination:
  voyage.villeArrivee ||
  'Trajet indéfini',
          places:
            voyage.placesDisponibles ??
            voyage.nombrePlaces ??
            0,

          statut:
            voyage.statut ||
            'INCONNU',

          dateDepart:
            voyage.dateDepart ||
            ''

        };

      }
    );


          // ===============================================
          // RESERVATIONS RECENTES
          // ===============================================

          this.reservationsRecentes =
            (dashboard.reservationsRecentes || [])
              .map(
                (
                  reservation: StaffReservationDTO
                ) => {

                  let client =
                    reservation.client || '';


                  if (!client) {

                    client =
                      `${reservation.prenomClient || ''} ${reservation.nomClient || ''}`
                        .trim();

                  }


                  if (!client) {

                    client = 'Client';

                  }


                  return {

                    numero:
                      reservation.numero ||
                      reservation.numeroVoyage ||
                      `RES-${reservation.id || ''}`,

                    client:

                      client,

                    trajet:

                      reservation.trajet ||
                      'Trajet inconnu',

                    statut:

                      reservation.statut ||
                      'INCONNU',

                    dateReservation:

                      reservation.dateReservation

                  };

                }
              );


          // ===============================================
          // FIN
          // ===============================================

          this.chargement = false;

          this.erreur = false;


          // ===============================================
          // LOGS
          // ===============================================

          console.log(
            '📊 Voyages :',
            this.nombreVoyages
          );

          console.log(
            '📊 Réservations :',
            this.nombreReservations
          );

          console.log(
            '🚌 Départs :',
            this.nombreDeparts
          );

          console.log(
            '🎫 Tickets scannés :',
            this.ticketsScannes
          );

          console.log(
            '📋 Prochains départs :',
            this.prochainsDeparts
          );

          console.log(
            '📋 Réservations récentes :',
            this.reservationsRecentes
          );

        },


        // =================================================
        // ERREUR
        // =================================================

        error: (error) => {

          console.error(
            '❌ Erreur chargement dashboard Staff :',
            error
          );


          this.nombreVoyages = 0;

          this.nombreReservations = 0;

          this.nombreDeparts = 0;

          this.ticketsScannes = 0;

          this.prochainsDeparts = [];

          this.reservationsRecentes = [];

          this.erreur = true;

          this.chargement = false;

        }

      });

  }


  // =====================================================
  // ACTUALISER
  // =====================================================

  actualiserDashboard(): void {

    this.chargerDashboard();

  }


  // =====================================================
  // VOYAGES
  // =====================================================

  voirVoyages(): void {

  console.log('🚌 Ouverture de la page Voyages Staff...');

  this.router.navigate(['/voyages']);

}

  // =====================================================
  // RESERVATIONS
  // =====================================================

  voirReservations(): void {

    console.log(
      'ℹ️ Page Réservations Staff non disponible pour le moment.'
    );
this.router.navigate(['/reservations']);
  }


  // =====================================================
  // SCANNER
  // =====================================================

  scannerTicket(): void {

    this.router.navigate([
      '/staff/scanner'
    ]);

  }


  // =====================================================
  // DEPARTS
  // =====================================================

  voirDeparts(): void {

    console.log(
      'ℹ️ Page Départs Staff non disponible pour le moment.'
    );
this.router.navigate(['staff/depart-du-jour']);
  }

}
