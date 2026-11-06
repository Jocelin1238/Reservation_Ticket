

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth';
import {
  NotificationService,
  Notification
} from '../../services/notification.service';

import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  /* =====================================================
     ÉTAT UTILISATEUR
  ====================================================== */

  estConnecte = false;

  roleUtilisateur = '';


  /* =====================================================
     MENU PROFIL
  ====================================================== */

  menuProfilOuvert = false;


  /* =====================================================
     NOTIFICATIONS
  ====================================================== */

  menuNotificationsOuvert = false;

  notifications: Notification[] = [];

  nombreNotifications = 0;

  chargementNotifications = false;

  private notificationSubscription?: Subscription;


  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}


  /* =====================================================
     INITIALISATION
  ====================================================== */

  ngOnInit(): void {

    this.estConnecte =
      this.authService.isLoggedIn();

    this.roleUtilisateur =
      this.authService.getUserRole();


    console.log('==============================');
    console.log('🧭 NAVBAR');
    console.log('🔐 Connecté :', this.estConnecte);
    console.log('👤 Rôle :', this.roleUtilisateur);
    console.log('==============================');


    /* =================================================
       CHARGEMENT NOTIFICATIONS
    ================================================= */

    if (this.estConnecte) {

      this.chargerNotifications();

      this.chargerNombreNotifications();


      /*
       * Vérification automatique toutes les 30 secondes
       */

      this.notificationSubscription =
        interval(30000).subscribe(() => {

          this.chargerNombreNotifications();

          if (this.menuNotificationsOuvert) {
            this.chargerNotifications();
          }

        });

    }

  }


  /* =====================================================
     DESTRUCTION
  ====================================================== */

  ngOnDestroy(): void {

    this.notificationSubscription?.unsubscribe();

  }


  /* =====================================================
     CHARGER TOUTES LES NOTIFICATIONS
  ====================================================== */

  chargerNotifications(): void {

    if (!this.estConnecte) {
      return;
    }

    this.chargementNotifications = true;

    this.notificationService
      .getNotifications()
      .subscribe({

        next: (data) => {

          this.notifications = data || [];

          this.chargementNotifications = false;

          console.log(
            '🔔 Notifications :',
            this.notifications
          );

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


  /* =====================================================
     CHARGER LE NOMBRE NON LU
  ====================================================== */

  chargerNombreNotifications(): void {

    if (!this.estConnecte) {
      return;
    }

    this.notificationService
      .getNombreNotifications()
      .subscribe({

        next: (nombre) => {

          this.nombreNotifications =
            nombre || 0;

        },

        error: (error) => {

          console.error(
            '❌ Erreur compteur notifications :',
            error
          );

          this.nombreNotifications = 0;

        }

      });

  }


  /* =====================================================
     OUVRIR / FERMER NOTIFICATIONS
  ====================================================== */

  toggleNotifications(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }

    this.menuNotificationsOuvert =
      !this.menuNotificationsOuvert;


    /*
     * Ferme le menu profil
     */

    if (this.menuNotificationsOuvert) {

      this.menuProfilOuvert = false;

      this.chargerNotifications();

    }

  }


  /* =====================================================
     FERMER NOTIFICATIONS
  ====================================================== */

  fermerNotifications(): void {

    this.menuNotificationsOuvert = false;

  }


  /* =====================================================
     MARQUER UNE NOTIFICATION COMME LUE
  ====================================================== */

  marquerNotificationCommeLue(
    notification: Notification
  ): void {

    if (notification.lu) {
      return;
    }

    this.notificationService
      .marquerCommeLue(notification.id)
      .subscribe({

        next: (notificationModifiee) => {

          notification.lu = true;

          /*
           * Mise à jour du compteur
           */

          if (this.nombreNotifications > 0) {
            this.nombreNotifications--;
          }

          console.log(
            '✅ Notification lue :',
            notificationModifiee
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur marquage notification :',
            error
          );

        }

      });

  }


  /* =====================================================
     MARQUER TOUTES COMME LUES
  ====================================================== */

  marquerToutesCommeLues(): void {

    if (this.nombreNotifications === 0) {
      return;
    }

    this.notificationService
      .marquerToutesCommeLues()
      .subscribe({

        next: () => {

          this.notifications.forEach(
            notification => {
              notification.lu = true;
            }
          );

          this.nombreNotifications = 0;

          console.log(
            '✅ Toutes les notifications sont lues'
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur marquage toutes notifications :',
            error
          );

        }

      });

  }


  /* =====================================================
     SUPPRIMER UNE NOTIFICATION
  ====================================================== */

  supprimerNotification(
    event: Event,
    notification: Notification
  ): void {

    /*
     * Empêche le clic de déclencher
     * le marquage comme lue
     */

    event.stopPropagation();

    this.notificationService
      .supprimerNotification(notification.id)
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.filter(
              n => n.id !== notification.id
            );


          /*
           * Si la notification supprimée
           * était non lue
           */

          if (!notification.lu &&
              this.nombreNotifications > 0) {

            this.nombreNotifications--;

          }

          console.log(
            '🗑️ Notification supprimée'
          );

        },

        error: (error) => {

          console.error(
            '❌ Erreur suppression notification :',
            error
          );

        }

      });

  }


  /* =====================================================
     TEXTE TYPE NOTIFICATION
  ====================================================== */

  getNotificationIcon(
    type: string
  ): string {

    switch (type) {

      case 'RESERVATION':
        return 'event_available';

      case 'PAIEMENT':
        return 'payments';

      case 'SYSTEME':
        return 'settings';

      default:
        return 'notifications';

    }

  }


  /* =====================================================
     FORMAT DATE
  ====================================================== */

  formaterDate(
    date: string
  ): string {

    if (!date) {
      return '';
    }

    const dateNotification =
      new Date(date);

    return dateNotification.toLocaleString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  /* =====================================================
     MENU PROFIL
  ====================================================== */

  toggleMenuProfil(): void {

    this.menuProfilOuvert =
      !this.menuProfilOuvert;


    /*
     * Ferme les notifications
     */

    if (this.menuProfilOuvert) {
      this.menuNotificationsOuvert = false;
    }

  }


  /* =====================================================
     NAVIGATION VOYAGES
  ====================================================== */

  allerAuxVoyages(): void {

    if (!this.estConnecte) {

      this.router.navigate(['/login']);

      return;
    }

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/voyages'
        ]);

        break;

      case 'ROLE_STAFF':

        this.router.navigate([
          '/gestion-voyages'
        ]);

        break;

      case 'ROLE_ADMIN':

      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/admin/voyages'
        ]);

        break;

      default:

        this.router.navigate([
          '/accueil'
        ]);

        break;

    }

  }


  /* =====================================================
     NAVIGATION RESERVATIONS
  ====================================================== */

  allerAuxReservations(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/reservations-user'
        ]);

        break;

      case 'ROLE_STAFF':

      case 'ROLE_ADMIN':

      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/reservations'
        ]);

        break;

      default:

        this.router.navigate([
          '/login'
        ]);

        break;

    }

  }


  /* =====================================================
     NAVIGATION TICKETS
  ====================================================== */

  allerAuxTickets(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/tickets-user'
        ]);

        break;

      case 'ROLE_STAFF':

        this.router.navigate([
          '/staff/scanner'
        ]);

        break;

      case 'ROLE_ADMIN':

      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/admin/tickets'
        ]);

        break;

      default:

        this.router.navigate([
          '/login'
        ]);

        break;

    }

  }


  /* =====================================================
     NAVIGATION PAIEMENTS
  ====================================================== */

  allerAuxPaiements(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/paiements-user'
        ]);

        break;

      case 'ROLE_ADMIN':

      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/admin/paiement'
        ]);

        break;

      case 'ROLE_STAFF':

        console.warn(
          '⚠️ Le Staff ne possède pas encore de page paiement.'
        );

        break;

      default:

        this.router.navigate([
          '/login'
        ]);

        break;

    }

  }


  /* =====================================================
     MON PROFIL
  ====================================================== */

  allerAuProfil(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;
    }

    this.menuProfilOuvert = false;

    this.router.navigate([
      '/profil'
    ]);

  }


  /* =====================================================
     PARAMÈTRES
  ====================================================== */

  allerAuxParametres(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/parametres'
      ]);

      return;
    }

    this.menuProfilOuvert = false;

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

      

        this.router.navigate([
          '/parametres'
        ]);

        break;

      case 'ROLE_ADMIN':

        this.router.navigate([
          '/admin/parametres'
        ]);

        break;

      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/superadmin/parametres'
        ]);

        break;

      default:

        this.router.navigate([
          '/accueil'
        ]);

        break;

    }

  }


  /* =====================================================
     DÉCONNEXION
  ====================================================== */

  deconnexion(): void {

    console.log(
      '🚪 Déconnexion...'
    );

    this.menuProfilOuvert = false;

    this.menuNotificationsOuvert = false;

    this.authService.logout();

    this.estConnecte = false;

    this.roleUtilisateur = '';

    this.router.navigate([
      '/login'
    ]);

  }

}