import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { VoyageService } from '../../services/voyage.service';
import { voyages } from '../../models/voyages';

@Component({
  selector: 'app-depart-du-jour',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './depart-du-jour.component.html',
  styleUrl: './depart-du-jour.component.css'
})
export class DepartDuJourComponent implements OnInit {

  voyages: voyages[] = [];
  voyagesFiltres: voyages[] = [];

  recherche = '';
  statutFiltre = 'TOUS';

  chargement = false;
  erreur = '';

  totalDepart = 0;
  departAVenir = 0;
  departEnCours = 0;
  departTermines = 0;

  constructor(
    private voyageService: VoyageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerDepartDuJour();
  }

  // =====================================================
  // CHARGER LES DEPARTS DU JOUR
  // =====================================================

  chargerDepartDuJour(): void {

    this.chargement = true;
    this.erreur = '';

    this.voyageService.getVoyagesDuJour().subscribe({

      next: (voyages) => {

        this.voyages = voyages || [];

        this.voyagesFiltres = [...this.voyages];

        this.calculerStatistiques();

        this.chargement = false;
      },

      error: (error) => {

        console.error(
          'Erreur chargement départs du jour :',
          error
        );

        this.erreur =
          'Impossible de charger les départs du jour.';

        this.chargement = false;
      }

    });

  }

  // =====================================================
  // STATISTIQUES
  // =====================================================

  calculerStatistiques(): void {

    this.totalDepart = this.voyages.length;

    this.departAVenir = this.voyages.filter(
      voyage => voyage.statut === 'DISPONIBLE'
    ).length;

    this.departEnCours = this.voyages.filter(
      voyage => voyage.statut === 'EN_COURS'
    ).length;

    this.departTermines = this.voyages.filter(
      voyage => voyage.statut === 'TERMINE'
    ).length;

  }

  // =====================================================
  // RECHERCHE
  // =====================================================

  rechercher(): void {
    this.appliquerFiltres();
  }

  // =====================================================
  // FILTRES
  // =====================================================

  appliquerFiltres(): void {

    const recherche =
      this.recherche
        .toLowerCase()
        .trim();

    this.voyagesFiltres = this.voyages.filter(voyage => {

      const numero =
        voyage.numeroVoyage
          ?.toLowerCase()
          || '';

      const depart =
        voyage.trajet?.villeDepart
          ?.toLowerCase()
          || '';

      const arrivee =
        voyage.trajet?.villeArrivee
          ?.toLowerCase()
          || '';

      const correspondRecherche =
        !recherche ||
        numero.includes(recherche) ||
        depart.includes(recherche) ||
        arrivee.includes(recherche);

      const correspondStatut =
        this.statutFiltre === 'TOUS' ||
        voyage.statut === this.statutFiltre;

      return correspondRecherche && correspondStatut;

    });

  }

  // =====================================================
  // CLASSE STATUT
  // =====================================================

  getClasseStatut(statut?: string): string {

    switch (statut) {

      case 'DISPONIBLE':
        return 'status-available';

      case 'EN_COURS':
        return 'status-progress';

      case 'TERMINE':
        return 'status-finished';

      case 'ANNULE':
        return 'status-cancelled';

      default:
        return 'status-default';
    }

  }

  // =====================================================
  // ICONE STATUT
  // =====================================================

  getIconStatut(statut?: string): string {

    switch (statut) {

      case 'DISPONIBLE':
        return 'schedule';

      case 'EN_COURS':
        return 'directions_bus';

      case 'TERMINE':
        return 'check_circle';

      case 'ANNULE':
        return 'block';

      default:
        return 'help';
    }

  }

  // =====================================================
  // VOIR DETAILS
  // =====================================================

  voirVoyage(voyage: voyages): void {

    this.router.navigate([
      '/staff/voyages',
      voyage.id
    ]);

  }

  // =====================================================
  // VOIR TICKETS
  // =====================================================

  voirTickets(voyage: voyages): void {

    this.router.navigate([
      '/staff/tickets'
    ], {
      queryParams: {
        voyageId: voyage.id
      }
    });

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
  // RETOUR DASHBOARD
  // =====================================================

  retourDashboard(): void {

    this.router.navigate([
      '/dashboard-staff'
    ]);

  }

}