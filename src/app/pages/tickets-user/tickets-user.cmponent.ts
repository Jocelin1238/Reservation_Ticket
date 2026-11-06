import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-tickets-user',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './tickets-user.component.html',
  styleUrl: './tickets-user.component.css'
})
export class TicketsUserComponent implements OnInit {

  tickets: any[] = [];

  chargement = true;
  erreur = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerTickets();
  }

  // =========================================================
  // CHARGER MES TICKETS
  // =========================================================

  chargerTickets(): void {

    this.chargement = true;
    this.erreur = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/tickets/mes-tickets'
    ).subscribe({

      next: (data) => {

        console.log(
          '🎟️ MES TICKETS :',
          data
        );

        this.tickets = data || [];

        this.chargement = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération tickets :',
          error
        );

        this.chargement = false;

        if (error.status === 401 || error.status === 403) {

          this.erreur =
            'Votre session a expiré. Veuillez vous reconnecter.';

        } else {

          this.erreur =
            'Impossible de récupérer vos tickets.';

        }

      }

    });
  }


  // =========================================================
  // RETOUR DASHBOARD
  // =========================================================

  

  // =========================================================
  // ALLER AUX VOYAGES
  // =========================================================

  allerVoyages(): void {

    this.router.navigate([
      '/voyages'
    ]);

  }


  // =========================================================
  // STATUT
  // =========================================================

  getStatutClass(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'VALIDE':
      case 'VALIDÉ':
      case 'VALIDE':
        return 'success';

      case 'UTILISE':
      case 'UTILISÉ':
        return 'used';

      case 'ANNULE':
      case 'ANNULÉ':
        return 'cancelled';

      default:
        return 'default';

    }

  }


  // =========================================================
  // LABEL STATUT
  // =========================================================

  getStatutLabel(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'VALIDE':
      case 'VALIDÉ':
        return 'Valide';

      case 'UTILISE':
      case 'UTILISÉ':
        return 'Utilisé';

      case 'ANNULE':
      case 'ANNULÉ':
        return 'Annulé';

      default:
        return statut || 'Inconnu';

    }

  }


  // =========================================================
  // DATE
  // =========================================================

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );

  }


  // =========================================================
  // HEURE
  // =========================================================

  formatHeure(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // =========================================================
  // QR CODE
  // =========================================================

  voirQrCode(ticket: any): void {

    console.log(
      '🔳 QR CODE DU TICKET :',
      ticket
    );

    // On ajoutera ici l'ouverture
    // du QR Code dans une modal.

  }

}