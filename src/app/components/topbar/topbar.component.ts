import {
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TopbarEventService } from '../../services/topbar-event.service';

import {
  NotificationService,
  Notification
} from '../../services/notification.service';

import { Subscription } from 'rxjs';


// =====================================================
// INTERFACE RECHERCHE UTILISATEUR
// =====================================================

interface UtilisateurRecherche {

  id: number;

  nom: string;

  prenom: string;

  email: string;

  actif: boolean;

}


// =====================================================
// COMPOSANT
// =====================================================

@Component({

  selector: 'app-topbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './topbar.component.html',

  styleUrl: './topbar.component.css'

})


export class TopbarComponent
  implements OnInit, OnDestroy {


  // =====================================================
  // UTILISATEUR CONNECTÉ
  // =====================================================

  utilisateur: any = null;

  nomComplet = '';

  initiales = '';

  roleUtilisateur = '';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  afficherNotifications = false;

  notifications: Notification[] = [];

  nombreNotifications = 0;

  private topbarSubscription!: Subscription;


  // =====================================================
  // PROFIL
  // =====================================================

  afficherProfil = false;


  // =====================================================
  // RECHERCHE
  // =====================================================

  recherche = '';

  afficherResultats = false;

  resultats: UtilisateurRecherche[] = [];

  rechercheEnCours = false;


  // =====================================================
  // API
  // =====================================================

  private readonly apiUrl =
    'http://localhost:8080/api/utilisateurs';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(

    private router: Router,

    private http: HttpClient,

    private notificationService: NotificationService,

    private topbarEventService: TopbarEventService

  ) {

    this.chargerUtilisateur();

  }


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    // =========================================
    // CHARGER NOTIFICATIONS
    // =========================================

    this.chargerNotifications();

    this.chargerNombreNotifications();


    // =========================================
    // ÉVÉNEMENT TOPBAR
    // =========================================

    this.topbarSubscription =
      this.topbarEventService
        .ouvrirNotifications$
        .subscribe(() => {

          console.log(
            '🔔 Ouverture des notifications'
          );

          this.afficherNotifications = true;

          this.afficherProfil = false;

          this.chargerNotifications();

          this.chargerNombreNotifications();

        });

  }


  // =====================================================
  // CHARGER UTILISATEUR CONNECTÉ
  // =====================================================

  chargerUtilisateur(): void {

    const user =
      localStorage.getItem('user');


    if (!user) {

      console.warn(
        '⚠️ Aucun utilisateur connecté'
      );

      return;

    }


    try {

      this.utilisateur =
        JSON.parse(user);


      console.log(
        '👤 Utilisateur Topbar :',
        this.utilisateur
      );


      // =========================================
      // PRÉNOM
      // =========================================

      const prenom =
        this.utilisateur.prenom || '';


      // =========================================
      // NOM
      // =========================================

      const nom =
        this.utilisateur.nom || '';


      // =========================================
      // NOM COMPLET
      // =========================================

      this.nomComplet =
        `${prenom} ${nom}`.trim();


      // =========================================
      // INITIALES
      // =========================================

      this.initiales =
        `${prenom.charAt(0)}${nom.charAt(0)}`
          .toUpperCase();


      // =========================================
      // ROLE
      // =========================================

      this.roleUtilisateur =
        this.utilisateur.role || '';


      console.log(
        '👤 Nom complet :',
        this.nomComplet
      );

      console.log(
        '🔤 Initiales :',
        this.initiales
      );

      console.log(
        '🎭 Rôle :',
        this.roleUtilisateur
      );

    }

    catch (error) {

      console.error(
        '❌ Erreur lecture utilisateur',
        error
      );

    }

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  chargerNotifications(): void {

    this.notificationService
      .getNotifications()
      .subscribe({

        next: (data) => {

          console.log(
            '🔔 Notifications reçues :',
            data
          );

          this.notifications = data;

        },

        error: (error) => {

          console.error(
            '❌ Erreur chargement notifications :',
            error
          );

        }

      });

  }


  // =====================================================
  // NOMBRE NOTIFICATIONS NON LUES
  // =====================================================

  chargerNombreNotifications(): void {

    this.notificationService
      .getNombreNotifications()
      .subscribe({

        next: (nombre) => {

          this.nombreNotifications =
            nombre;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération nombre notifications :',
            error
          );

        }

      });

  }


  // =====================================================
  // OUVRIR / FERMER NOTIFICATIONS
  // =====================================================

  toggleNotifications(): void {

    this.afficherNotifications =
      !this.afficherNotifications;


    // Fermer le profil

    this.afficherProfil = false;


    // Recharger les notifications

    if (this.afficherNotifications) {

      this.chargerNotifications();

      this.chargerNombreNotifications();

    }

  }


  // =====================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // =====================================================

  marquerCommeLue(
    notification: Notification
  ): void {

    if (notification.lu) {

      return;

    }


    this.notificationService
      .marquerCommeLue(notification.id)
      .subscribe({

        next: () => {

          notification.lu = true;

          this.chargerNombreNotifications();

        },

        error: (error) => {

          console.error(
            '❌ Erreur marquage notification :',
            error
          );

        }

      });

  }


  // =====================================================
  // MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  // =====================================================

  marquerToutesCommeLues(): void {

    this.notificationService
      .marquerToutesCommeLues()
      .subscribe({

        next: () => {

          console.log(
            '✅ Toutes les notifications sont lues'
          );


          this.notifications.forEach(
            notification => {

              notification.lu = true;

            }
          );


          this.nombreNotifications = 0;

        },

        error: (error) => {

          console.error(
            '❌ Erreur marquage notifications :',
            error
          );

        }

      });

  }


  // =====================================================
  // OUVRIR / FERMER PROFIL
  // =====================================================

  toggleProfil(): void {

    this.afficherProfil =
      !this.afficherProfil;


    // Fermer notifications

    this.afficherNotifications = false;

  }


  // =====================================================
  // MON PROFIL
  // =====================================================

  ouvrirProfil(): void {

    console.log(
      '👤 Ouverture du profil'
    );


    // Fermer le menu

    this.afficherProfil = false;


    // Aller vers profil

    this.router.navigate([
      '/profil'
    ]);

  }


  /// =====================================================
// PARAMÈTRES
// =====================================================

ouvrirParametres(): void {

  this.afficherProfil = false;

  switch (this.roleUtilisateur) {

    case 'ROLE_STAFF':

      this.router.navigate(['/parametres']);

      break;


    case 'ROLE_ADMIN':

      this.router.navigate(['/admin/parametres']);

      break;


    case 'ROLE_SUPER_ADMIN':

      this.router.navigate(['/superadmin/parametres']);

      break;


    default:

      console.error(
        '❌ Rôle utilisateur inconnu :',
        this.roleUtilisateur
      );

      break;
  }

}

  // =====================================================
  // RECHERCHE UTILISATEUR
  // =====================================================

  rechercher(): void {

    const keyword =
      this.recherche.trim();


    // =========================================
    // RECHERCHE TROP COURTE
    // =========================================

    if (keyword.length < 2) {

      this.resultats = [];

      this.afficherResultats = false;

      this.rechercheEnCours = false;

      return;

    }


    // =========================================
    // RECHERCHE EN COURS
    // =========================================

    this.rechercheEnCours = true;

    this.afficherResultats = true;


    // =========================================
    // APPEL API
    // =========================================

    this.http
      .get<UtilisateurRecherche[]>(

        `${this.apiUrl}/recherche`,

        {
          params: {
            keyword: keyword
          }
        }

      )
      .subscribe({

        next: (data) => {

          console.log(
            '🔎 Résultats recherche :',
            data
          );


          this.resultats = data;

          this.rechercheEnCours = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur recherche utilisateur :',
            error
          );


          this.resultats = [];

          this.rechercheEnCours = false;

        }

      });

  }


  // =====================================================
  // SÉLECTION UTILISATEUR
  // =====================================================

  selectionnerUtilisateur(
    utilisateur: UtilisateurRecherche
  ): void {

    this.recherche =
      `${utilisateur.prenom} ${utilisateur.nom}`;


    this.afficherResultats = false;

  }


  // =====================================================
  // VIDER RECHERCHE
  // =====================================================

  viderRecherche(): void {

    this.recherche = '';

    this.resultats = [];

    this.afficherResultats = false;

    this.rechercheEnCours = false;

  }


  // =====================================================
  // DÉCONNEXION
  // =====================================================

  logout(): void {

    console.log(
      '🚪 Déconnexion'
    );


    localStorage.removeItem(
      'token'
    );


    localStorage.removeItem(
      'user'
    );


    this.router.navigate([
      '/login'
    ]);

  }


  // =====================================================
  // CLIC EN DEHORS DES MENUS
  // =====================================================

  @HostListener(
    'document:click',
    ['$event']
  )

  fermerMenus(event: Event): void {

    const target =
      event.target as HTMLElement;


    // =========================================
    // SI CLIC EN DEHORS NOTIFICATION + PROFIL
    // =========================================

    if (

      !target.closest(
        '.notification-wrapper'
      )

      &&

      !target.closest(
        '.profile-wrapper'
      )

    ) {

      this.afficherNotifications =
        false;


      this.afficherProfil =
        false;

    }

  }


  // =====================================================
  // ROLE AFFICHÉ
  // =====================================================

  get roleAffiche(): string {

    switch (
      this.roleUtilisateur
    ) {

      case 'ROLE_STAFF':

        return 'Staff';


      case 'ROLE_ADMIN':

        return 'Administrateur';


      case 'ROLE_SUPER_ADMIN':

        return 'SuperAdmin';


      case 'ROLE_USER':

        return 'Utilisateur';


      default:

        return 'Utilisateur';

    }

  }


  // =====================================================
  // DESTRUCTION
  // =====================================================

  ngOnDestroy(): void {

    if (
      this.topbarSubscription
    ) {

      this.topbarSubscription.unsubscribe();

    }

  }

}