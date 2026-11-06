import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {

  ticket?: Ticket;

  chargement = true;
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.erreur = 'Identifiant du ticket invalide.';
      this.chargement = false;
      return;
    }

    this.chargerTicket(id);
  }

  chargerTicket(id: number): void {

    this.chargement = true;
    this.erreur = '';

    this.ticketService
      .getTicketById(id)
      .subscribe({

        next: (ticket) => {

          console.log('🎫 Ticket chargé :', ticket);

          this.ticket = ticket;

          this.chargement = false;
        },

        error: (error) => {

          console.error(
            'Erreur chargement ticket :',
            error
          );

          this.chargement = false;

          if (error.status === 404) {
            this.erreur = 'Ticket introuvable.';
          } else {
            this.erreur =
              'Impossible de charger les informations du ticket.';
          }
        }

      });
  }

  retourTickets(): void {
    this.router.navigate(['/tickets']);
  }

  scannerTicket(): void {
    this.router.navigate(['/staff/scanner']);
  }

  getClasseStatut(statut?: string): string {

    switch (statut) {

      case 'VALIDE':
        return 'valide';

      case 'UTILISE':
        return 'utilise';

      case 'ANNULE':
        return 'annule';

      default:
        return '';
    }
  }

  getIconStatut(statut?: string): string {

    switch (statut) {

      case 'VALIDE':
        return 'check_circle';

      case 'UTILISE':
        return 'verified';

      case 'ANNULE':
        return 'block';

      default:
        return 'help';
    }
  }
}