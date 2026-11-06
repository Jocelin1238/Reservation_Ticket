import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface VoyageUser {
  id: number;
  numeroVoyage: string;

  dateDepart: string;
  heureDepart: string;

  dateArrivee?: string;
  heureArrivee?: string;

  prix: number;

  nombrePlaces: number;
  placesDisponibles: number;

  statut?: string;
  description?: string;

  trajetId?: number;
  villeDepart?: string;
  villeArrivee?: string;

  confortId?: number;
  confort?: string;

  transportId?: number;
  transport?: string;
}

@Component({
  selector: 'app-voyage-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voyage-user-detail.component.html',
  styleUrl: './voyage-user-detail.component.css'
})
export class VoyageUserDetailComponent implements OnInit {

  voyage: VoyageUser | null = null;

  chargement = true;
  erreur = '';

  voyageId!: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.erreur = 'Identifiant du voyage introuvable.';
      this.chargement = false;

      return;
    }

    this.voyageId = Number(id);

    this.chargerVoyage();

  }


  // =====================================================
  // CHARGER LE VOYAGE
  // =====================================================

  chargerVoyage(): void {

    this.chargement = true;
    this.erreur = '';

    this.http
      .get<VoyageUser>(
        `http://localhost:8080/api/voyages/${this.voyageId}`
      )
      .subscribe({

        next: (data) => {

          console.log(
            '🚌 VOYAGE :',
            data
          );

          this.voyage = data;

          this.chargement = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération voyage :',
            error
          );

          this.chargement = false;

          if (error.status === 404) {

            this.erreur =
              'Le voyage demandé est introuvable.';

          } else if (
            error.status === 401 ||
            error.status === 403
          ) {

            this.erreur =
              'Votre session a expiré. Veuillez vous reconnecter.';

          } else {

            this.erreur =
              'Impossible de récupérer les informations du voyage.';

          }

        }

      });

  }


  // =====================================================
  // RETOUR AUX VOYAGES
  // =====================================================

  retourVoyages(): void {

    this.router.navigate([
      '/voyages'
    ]);

  }


  // =====================================================
  // RETOUR DASHBOARD
  // =====================================================

  retourDashboard(): void {

    this.router.navigate([
      '/dashboard-user'
    ]);

  }


  // =====================================================
  // RÉSERVER
  // =====================================================

  reserverVoyage(): void {

    if (!this.voyage) {
      return;
    }

    if (!this.peutReserver()) {
      return;
    }

    this.router.navigate(
      ['/reservation'],
      {
        queryParams: {
          voyageId: this.voyage.id
        }
      }
    );

  }


  // =====================================================
  // VÉRIFIER SI RÉSERVABLE
  // =====================================================

  peutReserver(): boolean {

    if (!this.voyage) {
      return false;
    }

    if (
      !this.voyage.placesDisponibles ||
      this.voyage.placesDisponibles <= 0
    ) {

      return false;

    }

    const statut =
      this.voyage.statut?.toUpperCase();

    return ![
      'ANNULE',
      'ANNULÉ',
      'ANNULEE',
      'ANNULÉE',
      'COMPLET'
    ].includes(statut || '');

  }


  // =====================================================
  // CLASSE STATUT
  // =====================================================

  getStatutClass(statut?: string): string {

    switch (
      statut?.toUpperCase()
    ) {

      case 'DISPONIBLE':
      case 'PROGRAMME':
      case 'CONFIRME':
      case 'CONFIRMÉ':

        return 'success';

      case 'COMPLET':
      case 'EN_ATTENTE':

        return 'pending';

      case 'ANNULE':
      case 'ANNULÉ':
      case 'ANNULEE':
      case 'ANNULÉE':

        return 'cancelled';

      default:

        return 'default';

    }

  }


  // =====================================================
  // LIBELLÉ STATUT
  // =====================================================

  getStatutLabel(statut?: string): string {

    if (!statut) {
      return 'Statut inconnu';
    }

    switch (
      statut.toUpperCase()
    ) {

      case 'DISPONIBLE':
        return 'Disponible';

      case 'PROGRAMME':
        return 'Programmé';

      case 'CONFIRME':
      case 'CONFIRMÉ':
        return 'Confirmé';

      case 'COMPLET':
        return 'Complet';

      case 'EN_ATTENTE':
        return 'En attente';

      case 'ANNULE':
      case 'ANNULÉ':
      case 'ANNULEE':
      case 'ANNULÉE':
        return 'Annulé';

      default:
        return statut;

    }

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(date?: string): string {

    if (!date) {
      return '-';
    }

    try {

      return new Intl.DateTimeFormat(
        'fr-FR',
        {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      ).format(
        new Date(date)
      );

    } catch {

      return date;

    }

  }


  // =====================================================
  // FORMAT DATE COURTE
  // =====================================================

  formatDateCourte(date?: string): string {

    if (!date) {
      return '-';
    }

    try {

      return new Intl.DateTimeFormat(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
      ).format(
        new Date(date)
      );

    } catch {

      return date;

    }

  }


  // =====================================================
  // FORMAT HEURE
  // =====================================================

  formatHeure(heure?: string): string {

    if (!heure) {
      return '-';
    }

    return heure.substring(0, 5);

  }


  // =====================================================
  // FORMAT PRIX
  // =====================================================

  formatPrix(prix?: number): string {

    if (
      prix === null ||
      prix === undefined
    ) {

      return '-';

    }

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(prix) + ' FCFA';

  }


  // =====================================================
  // POURCENTAGE DE PLACES
  // =====================================================

  get pourcentagePlaces(): number {

    if (
      !this.voyage ||
      !this.voyage.nombrePlaces ||
      this.voyage.nombrePlaces <= 0
    ) {

      return 0;

    }

    return Math.round(
      (
        this.voyage.placesDisponibles /
        this.voyage.nombrePlaces
      ) * 100
    );

  }

}