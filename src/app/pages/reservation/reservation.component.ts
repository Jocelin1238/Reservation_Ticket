import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  ReservationService,
 Reservation
} from '../../services/reservation.service';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { SidebarStaffComponent } from '../../components/sidebar-staff/sidebar-staff.component';
import { TopbarStaffComponent } from '../../components/topbar-staff/topbar-staff.component';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
     SidebarComponent,
  TopbarComponent,
  SidebarStaffComponent,
  TopbarStaffComponent, 
  SidebarAdminComponent 

  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  reservations: Reservation[] = [];
  reservationsFiltrees: Reservation[] = [];
roleUtilisateur = '';
  recherche = '';
  statutFiltre = 'TOUS';

  chargement = false;
  erreur = '';
reservationSelectionnee: Reservation | null = null;
detailsOuverts = false;
  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.roleUtilisateur =
    this.authService.getUserRole();

  console.log(
    '👤 Rôle réservation :',
    this.roleUtilisateur
  );
    this.chargerReservations();
  }

  chargerReservations(): void {

    this.chargement = true;
    this.erreur = '';

    this.reservationService.getAllReservations().subscribe({

      next: (data) => {

        console.log('Réservations reçues :', data);

        this.reservations = data;
        this.reservationsFiltrees = data;

        this.chargement = false;
      },

      error: (error) => {

        console.error(
          'Erreur chargement réservations :',
          error
        );

        this.erreur =
          'Impossible de charger les réservations.';

        this.chargement = false;
      }

    });
  }

  filtrerReservations(): void {

    const recherche =
      this.recherche.toLowerCase().trim();

    this.reservationsFiltrees =
      this.reservations.filter(reservation => {

        const nom =
          reservation.utilisateur?.nom?.toLowerCase() || '';

        const prenom =
          reservation.utilisateur?.prenom?.toLowerCase() || '';

        const email =
          reservation.utilisateur?.email?.toLowerCase() || '';

        const voyage =
          reservation.voyage?.numeroVoyage?.toLowerCase() || '';

        const depart =
          reservation.voyage?.trajet?.villeDepart
            ?.toLowerCase() || '';

        const arrivee =
          reservation.voyage?.trajet?.villeArrivee
            ?.toLowerCase() || '';

        const correspondRecherche =
          !recherche ||
          nom.includes(recherche) ||
          prenom.includes(recherche) ||
          email.includes(recherche) ||
          voyage.includes(recherche) ||
          depart.includes(recherche) ||
          arrivee.includes(recherche);

        const correspondStatut =
          this.statutFiltre === 'TOUS' ||
          reservation.statut === this.statutFiltre;

        return (
          correspondRecherche &&
          correspondStatut
        );
      });
  }

  changerStatutFiltre(): void {
    this.filtrerReservations();
  }

  getNombreTotal(): number {
    return this.reservations.length;
  }

  getNombreConfirmees(): number {
    return this.reservations.filter(
      r => r.statut === 'CONFIRMEE'
    ).length;
  }

  getNombreAnnulees(): number {
    return this.reservations.filter(
      r => r.statut === 'ANNULEE'
    ).length;
  }

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'fr-FR'
    );
  }

  formatDateTime(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString(
      'fr-FR'
    );
  }

  getStatutClass(statut: string): string {

    switch (statut) {

      case 'CONFIRMEE':
        return 'confirmee';

      case 'ANNULEE':
        return 'annulee';

      case 'EN_ATTENTE':
        return 'attente';

      default:
        return '';
    }
  }
  ouvrirDetails(reservation: Reservation): void {
  this.reservationSelectionnee = reservation;
  this.detailsOuverts = true;
}

fermerDetails(): void {
  this.detailsOuverts = false;
  this.reservationSelectionnee = null;
}
}