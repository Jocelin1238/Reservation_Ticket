import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


// =====================================================
// NOTIFICATION
// =====================================================

interface Notification {
  id: number;
  message: string;
  type: string;
  lu: boolean;
  dateCreation: string;
}


// =====================================================
// UTILISATEUR
// =====================================================

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  photo: string | null;
  role?: string;
}


@Component({
  selector: 'app-topbar-staff',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './topbar-staff.component.html',
  styleUrl: './topbar-staff.component.css'
})
export class TopbarStaffComponent implements OnInit {


  // =====================================================
  // UTILISATEUR CONNECTÉ
  // =====================================================

  utilisateur: Utilisateur | null = null;


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notifications: Notification[] = [];

  chargementNotifications = false;

  afficherNotifications = false;


  // =====================================================
  // PROFIL
  // =====================================================

  afficherProfil = false;


  // =====================================================
  // RECHERCHE
  // =====================================================

  recherche = '';


  // =====================================================
  // URL API
  // =====================================================

  private readonly API_URL =
    'http://localhost:8080/api';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    console.log(
      '🚀 Initialisation Topbar Staff'
    );

    this.chargerUtilisateur();

    this.chargerNotifications();

  }


  // =====================================================
  // UTILISATEUR
  // =====================================================

  chargerUtilisateur(): void {

    this.http
      .get<Utilisateur>(
        `${this.API_URL}/utilisateurs/me`
      )
      .subscribe({

        next: (data) => {

          console.log(
            '👤 Utilisateur Staff :',
            data
          );

          this.utilisateur = data;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération utilisateur :',
            error
          );

        }

      });

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  chargerNotifications(): void {

    this.chargementNotifications = true;

    this.http
      .get<Notification[]>(
        `${this.API_URL}/notifications`
      )
      .subscribe({

        next: (data) => {

          console.log(
            '🔔 Notifications Staff :',
            data
          );

          this.notifications = data ?? [];

          this.chargementNotifications = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération notifications :',
            error
          );

          this.notifications = [];

          this.chargementNotifications = false;

        }

      });

  }


  // =====================================================
  // NOMBRE DE NOTIFICATIONS NON LUES
  // =====================================================

  get nombreNotifications(): number {

    return this.notifications.filter(
      notification => !notification.lu
    ).length;

  }


  // =====================================================
  // OUVRIR / FERMER NOTIFICATIONS
  // =====================================================

  toggleNotifications(): void {

    this.afficherNotifications =
      !this.afficherNotifications;

    this.afficherProfil = false;

  }


  // =====================================================
  // OUVRIR / FERMER PROFIL
  // =====================================================

  toggleProfil(): void {

    this.afficherProfil =
      !this.afficherProfil;

    this.afficherNotifications = false;

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


    this.http
      .patch(
        `${this.API_URL}/notifications/${notification.id}/read`,
        {}
      )
      .subscribe({

        next: () => {

          notification.lu = true;

          console.log(
            '✅ Notification marquée comme lue :',
            notification.id
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur lecture notification :',
            error
          );

        }

      });

  }


  // =====================================================
  // MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  // =====================================================

  marquerToutesCommeLues(): void {

    if (this.nombreNotifications === 0) {
      return;
    }


    this.http
      .patch(
        `${this.API_URL}/notifications/read-all`,
        {}
      )
      .subscribe({

        next: () => {

          this.notifications.forEach(
            notification => {
              notification.lu = true;
            }
          );

          console.log(
            '✅ Toutes les notifications sont lues'
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur lecture notifications :',
            error
          );

        }

      });

  }


  // =====================================================
  // NOM COMPLET
  // =====================================================

  get nomComplet(): string {

    if (!this.utilisateur) {

      return 'Staff';

    }

    return `${this.utilisateur.prenom} ${this.utilisateur.nom}`;

  }


  // =====================================================
  // PRÉNOM
  // =====================================================

  get prenom(): string {

    if (!this.utilisateur) {

      return 'Staff';

    }

    return this.utilisateur.prenom;

  }


  // =====================================================
  // INITIALES
  // =====================================================

  get initiales(): string {

    if (!this.utilisateur) {

      return 'S';

    }

    const prenom =
      this.utilisateur.prenom?.charAt(0) || '';

    const nom =
      this.utilisateur.nom?.charAt(0) || '';

    return `${prenom}${nom}`.toUpperCase();

  }


  // =====================================================
  // ROLE
  // =====================================================

  get role(): string {

    if (!this.utilisateur) {

      return 'ROLE_STAFF';

    }

    return this.utilisateur.role || 'ROLE_STAFF';

  }


  // =====================================================
  // ROLE AFFICHÉ
  // =====================================================

  get roleAffiche(): string {

    switch (this.role) {

      case 'ROLE_STAFF':
        return 'Staff';

      case 'ROLE_ADMIN':
        return 'Administrateur';

      case 'ROLE_SUPER_ADMIN':
        return 'Super Administrateur';

      case 'ROLE_USER':
        return 'Utilisateur';

      default:
        return 'Staff';

    }

  }


  // =====================================================
  // PHOTO
  // =====================================================

  get photoUtilisateur(): string | null {

    if (
      !this.utilisateur ||
      !this.utilisateur.photo
    ) {

      return null;

    }

    return this.utilisateur.photo;

  }


  // =====================================================
  // RECHERCHE
  // =====================================================

  effectuerRecherche(): void {

    const valeur =
      this.recherche.trim();

    if (!valeur) {
      return;
    }


    console.log(
      '🔎 Recherche Staff :',
      valeur
    );

    /*
     * La recherche pourra ensuite être
     * connectée aux pages :
     *
     * - Voyages
     * - Réservations
     * - Tickets
     */

  }


  // =====================================================
  // PROFIL
  // =====================================================

  ouvrirProfil(): void {

    this.afficherProfil = false;

    this.router.navigate([
      '/profil'
    ]);

  }


  // =====================================================
  // PARAMÈTRES
  // =====================================================

  ouvrirParametres(): void {

    this.afficherProfil = false;

    this.router.navigate([
      '/parametres'
    ]);

  }


  // =====================================================
  // DECONNEXION
  // =====================================================

  logout(): void {

    console.log(
      '🚪 Déconnexion Staff'
    );

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.router.navigate([
      '/login'
    ]);

  }


  // =====================================================
  // FERMER LES MENUS EN CLIQUANT À L'EXTÉRIEUR
  // =====================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  fermerMenus(event: Event): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest(
        '.notification-wrapper'
      ) &&
      !target.closest(
        '.profile-wrapper'
      )
    ) {

      this.afficherNotifications = false;

      this.afficherProfil = false;

    }

  }

}