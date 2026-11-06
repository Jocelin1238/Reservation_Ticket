import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-reservations-user',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './reservations-user.component.html',
  styleUrl: './reservations-user.component.css'
})
export class ReservationsUserComponent implements OnInit {
private departRecherche = '';
private arriveeRecherche = '';
private dateRecherche = '';
  reservations: any[] = [];

  chargement = true;
  erreur = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {

    this.departRecherche =
      params['depart'] || '';

    this.arriveeRecherche =
      params['arrivee'] || '';

    this.dateRecherche =
      params['date'] || '';

  });

    this.chargerReservations();
  }

  // =====================================================
  // CHARGER MES RESERVATIONS
  // =====================================================

  chargerReservations(): void {

    this.chargement = false;
    this.erreur = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/reservations/mes-reservations'
    ).subscribe({
next: (data) => {

  console.log('📋 MES RESERVATIONS :', data);

  this.reservations = data || [];

  this.erreur = '';

  // IMPORTANT : le chargement est terminé
  this.chargement = false;

  console.log(
    '📊 Nombre réservations :',
    this.reservations.length
  );

  console.log(
    '⏳ chargement =',
    this.chargement
  );

},
      error: (error) => {

        console.error(
          '❌ Erreur récupération réservations :',
          error
        );

        this.chargement = false;

        if (error.status === 401 || error.status === 403) {

          this.erreur =
            'Votre session a expiré. Veuillez vous reconnecter.';

        } else {

          this.erreur =
            'Impossible de récupérer vos réservations.';

        }

      }

    });
  }


  

  // =====================================================
  // ALLER AUX VOYAGES
  // =====================================================

  allerVoyages(): void {

  this.router.navigate(
    ['/voyages'],
    {
      queryParams: {
        depart: this.departRecherche,
        arrivee: this.arriveeRecherche,
        date: this.dateRecherche
      }
    }
  );

}

  // =====================================================
  // NOMBRE DE RESERVATIONS CONFIRMEES
  // =====================================================

  get nombreConfirmees(): number {

    return this.reservations.filter(
      reservation => {

        const statut =
          reservation.statut?.toUpperCase();

        return (
          statut === 'CONFIRMEE' ||
          statut === 'CONFIRMÉE' ||
          statut === 'PAYEE' ||
          statut === 'PAYÉE'
        );

      }
    ).length;

  }


  // =====================================================
  // NOMBRE EN ATTENTE
  // =====================================================

  get nombreEnAttente(): number {

    return this.reservations.filter(
      reservation =>
        reservation.statut?.toUpperCase() === 'EN_ATTENTE'
    ).length;

  }


  // =====================================================
  // NOMBRE ANNULEES
  // =====================================================

  get nombreAnnulees(): number {

    return this.reservations.filter(
      reservation => {

        const statut =
          reservation.statut?.toUpperCase();

        return (
          statut === 'ANNULEE' ||
          statut === 'ANNULÉE'
        );

      }
    ).length;

  }


  // =====================================================
  // STATUT — CLASSE CSS
  // =====================================================

  getStatutClass(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'CONFIRMEE':
      case 'CONFIRMÉE':
      case 'PAYEE':
      case 'PAYÉE':
        return 'success';

      case 'EN_ATTENTE':
        return 'pending';

      case 'ANNULEE':
      case 'ANNULÉE':
        return 'cancelled';

      default:
        return 'default';

    }

  }


  // =====================================================
  // STATUT — LIBELLE
  // =====================================================

  getStatutLabel(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'CONFIRMEE':
      case 'CONFIRMÉE':
        return 'Confirmée';

      case 'PAYEE':
      case 'PAYÉE':
        return 'Payée';

      case 'EN_ATTENTE':
        return 'En attente';

      case 'ANNULEE':
      case 'ANNULÉE':
        return 'Annulée';

      default:
        return statut || 'Inconnu';

    }

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

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


  // =====================================================
  // FORMAT HEURE
  // =====================================================

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

}