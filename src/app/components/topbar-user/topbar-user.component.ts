import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth';

interface NotificationUser {
  id: number;
  message: string;
  type: string;
  lu: boolean;
  dateCreation: string;
}

@Component({
  selector: 'app-topbar-user',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './topbar-user.component.html',
  styleUrl: './topbar-user.component.css'
})
export class TopbarUserComponent implements OnInit {

  // =====================================================
  // RECHERCHE
  // =====================================================

  recherche = '';

  // =====================================================
  // UTILISATEUR
  // =====================================================

  nomComplet = 'Utilisateur';

  initiales = 'U';

  roleAffiche = 'Client';

  utilisateur: any = null;

  // =====================================================
  // PROFIL
  // =====================================================

  afficherProfil = false;

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notifications: NotificationUser[] = [];

  nombreNotificationsNonLues = 0;

  afficherNotifications = false;

  chargementNotifications = false;

  erreurNotifications = '';

  // =====================================================
  // API
  // =====================================================

  private readonly API_URL =
    'http://localhost:8080/api';

  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.chargerUtilisateur();

    this.chargerNotifications();

  }

  // =====================================================
  // UTILISATEUR
  // =====================================================

  chargerUtilisateur(): void {

    this.utilisateur =
      this.authService.getUtilisateur();

    if (!this.utilisateur) {

      return;

    }

    const prenom =
      this.utilisateur.prenom || '';

    const nom =
      this.utilisateur.nom || '';

    this.nomComplet =
      `${prenom} ${nom}`.trim()
      || this.utilisateur.email
      || 'Utilisateur';

    this.initiales =
      (
        (prenom.charAt(0) || '') +
        (nom.charAt(0) || '')
      ).toUpperCase()
      || 'U';

    this.roleAffiche = 'Client';

  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  chargerNotifications(): void {

    this.chargementNotifications = true;

    this.erreurNotifications = '';

    this.http.get<NotificationUser[]>(
      `${this.API_URL}/notifications`
    )
    .subscribe({

      next: (notifications) => {

        console.log(
          '🔔 NOTIFICATIONS CLIENT :',
          notifications
        );

        this.notifications =
          notifications || [];

        this.calculerNotificationsNonLues();

        this.chargementNotifications = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération notifications :',
          error
        );

        this.chargementNotifications = false;

        if (
          error.status === 401 ||
          error.status === 403
        ) {

          this.erreurNotifications =
            'Session expirée.';

        } else {

          this.erreurNotifications =
            'Impossible de récupérer les notifications.';

        }

      }

    });

  }

  // =====================================================
  // CALCULER LE NOMBRE DE NON LUES
  // =====================================================

  calculerNotificationsNonLues(): void {

    this.nombreNotificationsNonLues =
      this.notifications.filter(
        notification => !notification.lu
      ).length;

  }

  // =====================================================
  // OUVRIR / FERMER LES NOTIFICATIONS
  // =====================================================

  toggleNotifications(): void {

    this.afficherNotifications =
      !this.afficherNotifications;

    // Fermer le menu profil
    if (this.afficherNotifications) {

      this.afficherProfil = false;

      // Actualiser les notifications
      this.chargerNotifications();

    }

  }

  // =====================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // =====================================================

  marquerCommeLue(
    notification: NotificationUser
  ): void {

    if (notification.lu) {

      return;

    }

    this.http.patch<NotificationUser>(
      `${this.API_URL}/notifications/${notification.id}/read`,
      {}
    )
    .subscribe({

      next: (notificationModifiee) => {

        console.log(
          '✅ Notification lue :',
          notificationModifiee
        );

        notification.lu = true;

        this.calculerNotificationsNonLues();

      },

      error: (error) => {

        console.error(
          '❌ Erreur notification :',
          error
        );

      }

    });

  }

  // =====================================================
  // MARQUER TOUT COMME LU
  // =====================================================

  marquerToutCommeLu(): void {

    if (
      this.nombreNotificationsNonLues === 0
    ) {

      return;

    }

    this.http.patch(
      `${this.API_URL}/notifications/read-all`,
      {}
    )
    .subscribe({

      next: () => {

        console.log(
          '✅ Toutes les notifications sont lues'
        );

        this.notifications =
          this.notifications.map(
            notification => ({
              ...notification,
              lu: true
            })
          );

        this.nombreNotificationsNonLues = 0;

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
  // SUPPRIMER NOTIFICATION
  // =====================================================

  supprimerNotification(
    notification: NotificationUser
  ): void {

    this.http.delete(
      `${this.API_URL}/notifications/${notification.id}`
    )
    .subscribe({

      next: () => {

        console.log(
          '🗑️ Notification supprimée'
        );

        this.notifications =
          this.notifications.filter(
            item => item.id !== notification.id
          );

        this.calculerNotificationsNonLues();

      },

      error: (error) => {

        console.error(
          '❌ Erreur suppression notification :',
          error
        );

      }

    });

  }

  // =====================================================
  // ICÔNE NOTIFICATION
  // =====================================================

  getNotificationIcon(
    type?: string
  ): string {

    switch (
      type?.toUpperCase()
    ) {

      case 'RESERVATION':
        return 'confirmation_number';

      case 'PAIEMENT':
        return 'payments';

      case 'VOYAGE':
        return 'directions_bus';

      case 'UTILISATEUR':
        return 'person';

      case 'SYSTEME':
        return 'info';

      default:
        return 'notifications';

    }

  }

  // =====================================================
  // CLASSE NOTIFICATION
  // =====================================================

  getNotificationClass(
    type?: string
  ): string {

    switch (
      type?.toUpperCase()
    ) {

      case 'RESERVATION':
        return 'reservation';

      case 'PAIEMENT':
        return 'paiement';

      case 'VOYAGE':
        return 'voyage';

      case 'UTILISATEUR':
        return 'utilisateur';

      case 'SYSTEME':
        return 'systeme';

      default:
        return 'default';

    }

  }

  // =====================================================
  // TYPE NOTIFICATION
  // =====================================================

  getNotificationType(
    type?: string
  ): string {

    switch (
      type?.toUpperCase()
    ) {

      case 'RESERVATION':
        return 'Réservation';

      case 'PAIEMENT':
        return 'Paiement';

      case 'VOYAGE':
        return 'Voyage';

      case 'UTILISATEUR':
        return 'Utilisateur';

      case 'SYSTEME':
        return 'Système';

      default:
        return 'Notification';

    }

  }

  // =====================================================
  // DATE NOTIFICATION
  // =====================================================

  formatDateNotification(
    date?: string
  ): string {

    if (!date) {

      return '';

    }

    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

  // =====================================================
  // HEURE NOTIFICATION
  // =====================================================

  formatHeureNotification(
    date?: string
  ): string {

    if (!date) {

      return '';

    }

    return new Date(date).toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

  // =====================================================
  // RECHERCHE
  // =====================================================

  rechercher(): void {

    console.log(
      '🔎 Recherche :',
      this.recherche
    );

  }

  viderRecherche(): void {

    this.recherche = '';

  }

  // =====================================================
  // PROFIL
  // =====================================================

  toggleProfil(): void {

    this.afficherProfil =
      !this.afficherProfil;

    // Fermer les notifications
    if (this.afficherProfil) {

      this.afficherNotifications = false;

    }

  }

  // =====================================================
  // OUVRIR PROFIL
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

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}