import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-paiements-user',
  standalone: true,
  imports: [CommonModule,NavbarComponent ],
  templateUrl: './paiements-user.component.html',
  styleUrl: './paiements-user.component.css'
})
export class PaiementsUserComponent implements OnInit {

  // =====================================================
  // DONNÉES
  // =====================================================

  paiements: any[] = [];

  chargement = true;
  erreur = '';

  // =====================================================
  // STATISTIQUES
  // =====================================================

  totalPaye = 0;

  nombrePaiementsEnAttente = 0;

  nombrePaiementsReussis = 0;

  nombrePaiementsEchec = 0;

  // =====================================================
  // PAIEMENT SÉLECTIONNÉ
  // =====================================================

  paiementSelectionne: any = null;

  afficherDetails = false;


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.chargerPaiements();

  }


  // =====================================================
  // CHARGER MES PAIEMENTS
  // =====================================================

  chargerPaiements(): void {

    this.chargement = true;
    this.erreur = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/paiements/mes-paiements'
    ).subscribe({

      next: (data) => {

        console.log(
          '💳 MES PAIEMENTS :',
          data
        );

        this.paiements = data || [];

        // Calcul des statistiques
        this.calculerStatistiques();

        this.chargement = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération paiements :',
          error
        );

        this.chargement = false;

        if (
          error.status === 401 ||
          error.status === 403
        ) {

          this.erreur =
            'Votre session a expiré. Veuillez vous reconnecter.';

        } else {

          this.erreur =
            'Impossible de récupérer vos paiements.';

        }

      }

    });

  }


  // =====================================================
  // CALCULER LES STATISTIQUES
  // =====================================================

  calculerStatistiques(): void {

    this.totalPaye = 0;

    this.nombrePaiementsEnAttente = 0;

    this.nombrePaiementsReussis = 0;

    this.nombrePaiementsEchec = 0;


    this.paiements.forEach((paiement) => {

      const statut =
        paiement?.statut?.toUpperCase() || '';

      const montant =
        Number(paiement?.montant) || 0;


      // -------------------------------
      // PAIEMENTS RÉUSSIS
      // -------------------------------

      if (
        statut === 'REUSSI' ||
        statut === 'RÉUSSI' ||
        statut === 'PAYE' ||
        statut === 'PAYÉ'
      ) {

        this.totalPaye += montant;

        this.nombrePaiementsReussis++;

      }


      // -------------------------------
      // PAIEMENTS EN ATTENTE
      // -------------------------------

      else if (
        statut === 'EN_COURS' ||
        statut === 'EN COURS' ||
        statut === 'EN_ATTENTE' ||
        statut === 'EN ATTENTE'
      ) {

        this.nombrePaiementsEnAttente++;

      }


      // -------------------------------
      // PAIEMENTS ÉCHOUÉS
      // -------------------------------

      else if (
        statut === 'ECHEC' ||
        statut === 'ÉCHEC'
      ) {

        this.nombrePaiementsEchec++;

      }

    });

  }


  // =====================================================
  // VOIR LES DÉTAILS D'UN PAIEMENT
  // =====================================================

  voirDetails(paiement: any): void {

    if (!paiement) {
      return;
    }

    this.paiementSelectionne = paiement;

    this.afficherDetails = true;

  }


  // =====================================================
  // FERMER LES DÉTAILS
  // =====================================================

  fermerDetails(): void {

    this.afficherDetails = false;

    this.paiementSelectionne = null;

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
  // ALLER AUX VOYAGES
  // =====================================================

  allerVoyages(): void {

    this.router.navigate([
      '/voyages'
    ]);

  }


  // =====================================================
  // ALLER AUX RÉSERVATIONS
  // =====================================================

  allerReservations(): void {

    this.router.navigate([
      '/reservations-user'
    ]);

  }


  // =====================================================
  // ALLER AUX TICKETS
  // =====================================================

  allerTickets(): void {

    this.router.navigate([
      '/tickets-user'
    ]);

  }


  // =====================================================
  // FORMAT MONTANT
  // =====================================================

  formatMontant(montant: number): string {

    if (
      montant === null ||
      montant === undefined ||
      isNaN(Number(montant))
    ) {

      return '0 FCFA';

    }

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(Number(montant)) + ' FCFA';

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(date: string): string {

    if (!date) {

      return '-';

    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {

      return '-';

    }

    return dateObj.toLocaleDateString(
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

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {

      return '-';

    }

    return dateObj.toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // =====================================================
  // STATUT — CLASSE CSS
  // =====================================================

  getStatutClass(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'REUSSI':
      case 'RÉUSSI':
      case 'PAYE':
      case 'PAYÉ':

        return 'success';


      case 'EN_COURS':
      case 'EN COURS':
      case 'EN_ATTENTE':
      case 'EN ATTENTE':

        return 'pending';


      case 'ECHEC':
      case 'ÉCHEC':

        return 'failed';


      default:

        return 'default';

    }

  }


  // =====================================================
  // STATUT — LIBELLÉ
  // =====================================================

  getStatutLabel(statut: string): string {

    switch (statut?.toUpperCase()) {

      case 'REUSSI':
      case 'RÉUSSI':

        return 'Réussi';


      case 'PAYE':
      case 'PAYÉ':

        return 'Payé';


      case 'EN_COURS':
      case 'EN COURS':

        return 'En cours';


      case 'EN_ATTENTE':
      case 'EN ATTENTE':

        return 'En attente';


      case 'ECHEC':
      case 'ÉCHEC':

        return 'Échec';


      default:

        return statut || 'Inconnu';

    }

  }


  // =====================================================
  // MÉTHODE DE PAIEMENT
  // =====================================================

  getMethodeLabel(methode: string): string {

    switch (methode?.toUpperCase()) {

      case 'MOMO':

        return 'MTN Mobile Money';


      case 'OM':

        return 'Orange Money';


      case 'CARTE':

        return 'Carte bancaire';


      default:

        return methode || 'Non précisée';

    }

  }


  // =====================================================
  // ICÔNE MÉTHODE
  // =====================================================

  getMethodeIcon(methode: string): string {

    switch (methode?.toUpperCase()) {

      case 'MOMO':
      case 'OM':

        return 'phone_android';


      case 'CARTE':

        return 'credit_card';


      default:

        return 'payments';

    }

  }

}