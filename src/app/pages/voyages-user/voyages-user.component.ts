import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { VoyageService, StaffVoyageDTO } from '../../services/voyage.service';

interface Ville {
  id: number;
  nom: string;
  actif: boolean;
}

interface VoyageUser extends StaffVoyageDTO {
  id: number;
  numeroVoyage: string;

  dateDepart: string;
  heureDepart: string;

  prix: number;

  nombrePlaces: number;
  placesDisponibles: number;
}

@Component({
  selector: 'app-voyages-user',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],

  templateUrl: './voyages-user.component.html',
  styleUrl: './voyages-user.component.css'
})
export class VoyagesUserComponent implements OnInit {

  // =====================================================
  // RECHERCHE
  // =====================================================

  villeDepartRecherche = '';
  villeArriveeRecherche = '';
  dateRecherche = '';
  transportRecherche = '';

  // =====================================================
  // VILLES
  // =====================================================

  villes: Ville[] = [];

  chargementVilles = false;

  // =====================================================
  // VOYAGES
  // =====================================================

  voyages: VoyageUser[] = [];

  voyagesFiltres: VoyageUser[] = [];

  // =====================================================
  // ÉTAT
  // =====================================================

  chargement = true;
  erreur = '';

  // =====================================================
  // RECHERCHE TEXTE
  // =====================================================

  recherche = '';

  filtreStatut = 'TOUS';

  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private voyageService: VoyageService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    // Charger les villes une seule fois
    this.chargerVilles();

    // Écouter les paramètres de recherche
    this.route.queryParams.subscribe(params => {

      this.villeDepartRecherche =
        params['depart'] || '';

      this.villeArriveeRecherche =
        params['arrivee'] || '';

      this.dateRecherche =
        params['date'] || '';

      this.transportRecherche =
        params['transport'] || '';

      // Si les voyages sont déjà chargés,
      // on applique simplement les filtres.
      if (this.voyages.length > 0) {
        this.appliquerFiltres();
      }

    });

    // Charger les voyages
    this.chargerVoyages();

  }

  // =====================================================
  // CHARGER LES VOYAGES
  // =====================================================

  chargerVoyages(): void {

    this.chargement = true;
    this.erreur = '';

    this.voyageService
      .getAllVoyages()
      .subscribe({

        next: (data) => {

          console.log(
            '🚌 VOYAGES REÇUS :',
            data
          );

          this.voyages =
            (data || []) as VoyageUser[];

          this.appliquerFiltres();

          this.chargement = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération voyages :',
            error
          );

          this.chargement = false;

          this.erreur =
            error?.error?.message ||
            'Impossible de récupérer les voyages disponibles.';

        }

      });

  }

  // =====================================================
  // CHARGER LES VILLES
  // =====================================================

  chargerVilles(): void {

    // Éviter de refaire la requête
    if (this.villes.length > 0) {
      return;
    }

    this.chargementVilles = true;

    this.http
      .get<Ville[]>(
        'http://localhost:8080/api/villes'
      )
      .subscribe({

        next: (data) => {

          console.log(
            '🏙️ VILLES DISPONIBLES :',
            data
          );

          this.villes = data || [];

          this.chargementVilles = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération villes :',
            error
          );

          this.chargementVilles = false;

        }

      });

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

    const texte =
      this.recherche
        .trim()
        .toLowerCase();

    const rechercheDepart =
      this.villeDepartRecherche
        .trim()
        .toLowerCase();

    const rechercheArrivee =
      this.villeArriveeRecherche
        .trim()
        .toLowerCase();

    const rechercheTransport =
      this.transportRecherche
        .trim()
        .toLowerCase();

    this.voyagesFiltres =
      this.voyages.filter(voyage => {

        // ============================================
        // RECHERCHE TEXTE
        // ============================================

        const correspondRecherche =

          !texte ||

          voyage.numeroVoyage
            ?.toLowerCase()
            .includes(texte) ||

          voyage.villeDepart
            ?.toLowerCase()
            .includes(texte) ||

          voyage.villeArrivee
            ?.toLowerCase()
            .includes(texte) ||

          voyage.transport
            ?.toLowerCase()
            .includes(texte) ||

          voyage.confort
            ?.toLowerCase()
            .includes(texte);

        // ============================================
        // DÉPART
        // ============================================

        const departNormalise =
          voyage.villeDepart
            ?.trim()
            .toLowerCase();

        const correspondDepart =
          !rechercheDepart ||
          departNormalise === rechercheDepart;

        // ============================================
        // ARRIVÉE
        // ============================================

        const arriveeNormalisee =
          voyage.villeArrivee
            ?.trim()
            .toLowerCase();

        const correspondArrivee =
          !rechercheArrivee ||
          arriveeNormalisee === rechercheArrivee;

        // ============================================
        // TRANSPORT
        // ============================================

        const transportNormalise =
          voyage.transport
            ?.trim()
            .toLowerCase();

        const correspondTransport =
          !rechercheTransport ||
          transportNormalise === rechercheTransport;

        // ============================================
        // DATE
        // ============================================

        const correspondDate =
          !this.dateRecherche ||
          voyage.dateDepart === this.dateRecherche;

        // ============================================
        // STATUT
        // ============================================

        const correspondStatut =
          this.filtreStatut === 'TOUS' ||
          voyage.statut?.toUpperCase() ===
            this.filtreStatut;

        return (

          correspondDepart &&
          correspondArrivee &&
          correspondDate &&
          correspondTransport &&
          correspondRecherche &&
          correspondStatut

        );

      });

  }

  // =====================================================
  // CHANGER FILTRE
  // =====================================================

  changerFiltre(statut: string): void {

    this.filtreStatut = statut;

    this.appliquerFiltres();

  }

  // =====================================================
  // RÉSERVER
  // =====================================================

  reserverVoyage(voyage: VoyageUser): void {

    if (!this.peutReserver(voyage)) {

      console.warn(
        '⛔ Voyage non réservable :',
        voyage
      );

      return;
    }

    const confirmation = confirm(
      `Voulez-vous réserver le voyage ${voyage.numeroVoyage} ?`
    );

    if (!confirmation) {
      return;
    }

    this.http
      .post(
        `http://localhost:8080/api/reservations/${voyage.id}`,
        {}
      )
      .subscribe({

        next: (reservation) => {

          console.log(
            '✅ Réservation créée :',
            reservation
          );

          alert(
            'Votre réservation a été créée avec succès.'
          );

          this.router.navigate(
            ['/reservations-user'],
            {
              queryParams: {
                depart: this.villeDepartRecherche,
                arrivee: this.villeArriveeRecherche,
                date: this.dateRecherche
              }
            }
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur création réservation :',
            error
          );

          if (error.status === 401) {

            alert(
              'Votre session a expiré. Veuillez vous reconnecter.'
            );

            this.router.navigate(['/login']);

            return;
          }

          if (error.status === 403) {

            alert(
              'Vous n’avez pas l’autorisation de réserver ce voyage.'
            );

            return;
          }

          alert(
            error?.error?.message ||
            'Impossible de créer la réservation.'
          );

        }

      });

  }

  // =====================================================
  // VOIR DÉTAILS
  // =====================================================

  voirDetails(id: number): void {

    this.router.navigate([
      '/voyage-user-detail',
      id
    ]);

  }

  // =====================================================
  // STATUT
  // =====================================================

  getStatutClass(statut?: string): string {

    switch (statut?.toUpperCase()) {

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

    switch (statut.toUpperCase()) {

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
  // DATE
  // =====================================================

  formatDate(date?: string): string {

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
      ).format(new Date(date));

    } catch {

      return date;

    }

  }

  // =====================================================
  // HEURE
  // =====================================================

  formatHeure(heure?: string): string {

    if (!heure) {
      return '-';
    }

    return heure.substring(0, 5);

  }

  // =====================================================
  // PRIX
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
  // STATISTIQUES
  // =====================================================

  get nombreVoyagesDisponibles(): number {

    return this.voyages.filter(
      voyage =>
        voyage.placesDisponibles > 0 &&
        ![
          'ANNULE',
          'ANNULÉ',
          'ANNULEE',
          'ANNULÉE'
        ].includes(
          voyage.statut?.toUpperCase() || ''
        )
    ).length;

  }

  get nombrePlacesDisponibles(): number {

    return this.voyages.reduce(
      (total, voyage) =>
        total +
        (voyage.placesDisponibles || 0),
      0
    );

  }

  get nombreVoyagesAujourdHui(): number {

    const aujourdHui =
      new Date()
        .toISOString()
        .split('T')[0];

    return this.voyages.filter(
      voyage =>
        voyage.dateDepart === aujourdHui
    ).length;

  }

  get prixMoyen(): number {

    if (!this.voyages.length) {
      return 0;
    }

    const total =
      this.voyages.reduce(
        (somme, voyage) =>
          somme +
          (voyage.prix || 0),
        0
      );

    return total / this.voyages.length;

  }

  // =====================================================
  // PEUT RÉSERVER
  // =====================================================

  peutReserver(
    voyage: VoyageUser
  ): boolean {

    if (
      !voyage.placesDisponibles ||
      voyage.placesDisponibles <= 0
    ) {
      return false;
    }

    const statut =
      voyage.statut?.toUpperCase();

    if (
      statut === 'ANNULE' ||
      statut === 'ANNULE' ||
      statut === 'ANNULEE' ||
      statut === 'ANNULEE' ||
      statut === 'COMPLET'
    ) {
      return false;
    }

    return true;

  }

}