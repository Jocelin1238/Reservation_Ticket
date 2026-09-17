import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

  tickets: Ticket[] = [];

  ticketsFiltres: Ticket[] = [];

  recherche = '';

  statutFiltre = 'TOUS';

  chargement = false;

  erreur = '';

  constructor(
    private ticketService: TicketService,
    private router: Router,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerTickets();
  }

  // ==========================================
  // CHARGER LES TICKETS
  // ==========================================

  chargerTickets(): void {

    this.chargement = true;
    this.erreur = '';

    this.ticketService.getAllTickets().subscribe({

      next: (tickets: Ticket[]) => {

  this.tickets = tickets || [];

  this.appliquerFiltres();

  this.chargement = false;

},

      error: (error) => {

        console.error(
          'Erreur chargement tickets :',
          error
        );

        this.chargement = false;

        this.erreur =
          'Impossible de charger les tickets.';

      }

    });

  }

  // ==========================================
  // FILTRAGE
  // ==========================================

  appliquerFiltres(): void {

    const recherche =
      this.recherche
        .trim()
        .toLowerCase();

    this.ticketsFiltres =
      this.tickets.filter(ticket => {

        const correspondRecherche =
          !recherche ||

          ticket.codeTicket
            ?.toLowerCase()
            .includes(recherche)

          ||

          ticket.reservation?.utilisateur?.nom
            ?.toLowerCase()
            .includes(recherche)

          ||

          ticket.reservation?.utilisateur?.prenom
            ?.toLowerCase()
            .includes(recherche)

          ||

          ticket.reservation?.utilisateur?.email
            ?.toLowerCase()
            .includes(recherche)

          ||

          ticket.reservation?.voyage?.numeroVoyage
            ?.toLowerCase()
            .includes(recherche);


        const correspondStatut =
          this.statutFiltre === 'TOUS' ||
          ticket.statut === this.statutFiltre;


        return correspondRecherche &&
               correspondStatut;

      });

  }

  // ==========================================
  // RECHERCHE
  // ==========================================

  rechercher(): void {

    this.appliquerFiltres();

  }

  // ==========================================
  // STATISTIQUES
  // ==========================================

  get totalTickets(): number {

    return this.tickets.length;

  }

  get ticketsValides(): number {

    return this.tickets.filter(
      ticket => ticket.statut === 'VALIDE'
    ).length;

  }

  get ticketsUtilises(): number {

    return this.tickets.filter(
      ticket => ticket.statut === 'UTILISE'
    ).length;

  }

  get ticketsAnnules(): number {

    return this.tickets.filter(
      ticket => ticket.statut === 'ANNULE'
    ).length;

  }

  // ==========================================
  // VOIR DETAIL
  // ==========================================

  voirTicket(ticket: Ticket): void {

  console.log('Ouverture du ticket :', ticket.id);

  this.router.navigate([
    '/tickets',
    ticket.id
  ]);
}

  // ==========================================
  // SCANNER
  // ==========================================

  scannerTicket(): void {

    this.router.navigate([
      '/staff/scanner'
    ]);

  }

  // ==========================================
  // STATUT
  // ==========================================

  getClasseStatut(statut: string): string {

    switch (statut) {

      case 'VALIDE':
        return 'statut-valide';

      case 'UTILISE':
        return 'statut-utilise';

      case 'ANNULE':
        return 'statut-annule';

      default:
        return '';

    }

  }

  getIconStatut(statut: string): string {

    switch (statut) {

      case 'VALIDE':
        return 'check_circle';

      case 'UTILISE':
        return 'check_circle_outline';

      case 'ANNULE':
        return 'block';

      default:
        return 'help';

    }

  }
retourDashboard(): void {
  const role = this.authService.getUserRole();

  if (role === 'ROLE_SUPER_ADMIN') {
    this.router.navigate(['/dashboard-superadmin']);
  } 
  else if (role === 'ROLE_ADMIN') {
    this.router.navigate(['/dashboard-admin']);
  } 
  else if (role === 'ROLE_STAFF') {
    this.router.navigate(['/dashboard-staff']);
  } 
  else {
    this.router.navigate(['/']);
  }
}
}