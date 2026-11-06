import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

import { SidebarUserComponent } from '../../components/sidebar-user/sidebar-user.component';
import { TopbarUserComponent } from '../../components/topbar-user/topbar-user.component';

interface NotificationUser {
  id: number;
  message: string;
  type: string;
  lu: boolean;
  dateCreation: string;
}

@Component({
  selector: 'app-dashboard-user',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    SidebarUserComponent,
    TopbarUserComponent
  ],

  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.css'
})
export class DashboardUserComponent implements OnInit {

  // =====================================================
  // INFORMATIONS UTILISATEUR
  // =====================================================

  nomUtilisateur = '';
  prenomUtilisateur = '';
  emailUtilisateur = '';
  roleUtilisateur = '';

  // =====================================================
  // STATISTIQUES
  // =====================================================

  nombreReservations = 0;
  nombreTickets = 0;
  nombrePaiements = 0;

  // =====================================================
  // ÉTATS
  // =====================================================

  chargementReservations = false;
  chargementTickets = false;

  erreurReservations = false;
  erreurTickets = false;

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notifications: NotificationUser[] = [];

  notificationsNonLues = 0;

  chargementNotifications = false;

  erreurNotifications = false;

  afficherNotifications = false;

  // =====================================================
  // URL API
  // =====================================================

  private readonly API_URL =
    'http://localhost:8080/api';

  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.chargerUtilisateur();

    this.chargerReservations();

    this.chargerTickets();

    this.chargerNotifications();

  }

  // =====================================================
  // CHARGER UTILISATEUR
  // =====================================================

  chargerUtilisateur(): void {

    const utilisateur =
      this.authService.getUtilisateur();

    console.log(
      '👤 UTILISATEUR DU DASHBOARD :',
      utilisateur
    );

    if (!utilisateur) {

      console.warn(
        '⚠️ Aucun utilisateur connecté'
      );

      this.router.navigate(['/login']);

      return;
    }

    this.nomUtilisateur =
      utilisateur.nom || '';

    this.prenomUtilisateur =
      utilisateur.prenom || '';

    this.emailUtilisateur =
      utilisateur.email || '';

    this.roleUtilisateur =
      this.authService.getUserRole();

  }

  // =====================================================
  // CHARGER MES RESERVATIONS
  // =====================================================

  chargerReservations(): void {

    this.chargementReservations = true;

    this.erreurReservations = false;

    this.http.get<any[]>(
      `${this.API_URL}/reservations/mes-reservations`
    )
    .subscribe({

      next: (reservations) => {

        console.log(
          '📋 MES RESERVATIONS :',
          reservations
        );

        this.nombreReservations =
          reservations?.length || 0;

        this.chargementReservations = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération réservations :',
          error
        );

        this.erreurReservations = true;

        this.chargementReservations = false;

      }

    });

  }

  // =====================================================
  // CHARGER MES TICKETS
  // =====================================================

  chargerTickets(): void {

    this.chargementTickets = true;

    this.erreurTickets = false;

    this.http.get<any[]>(
      `${this.API_URL}/tickets/mes-tickets`
    )
    .subscribe({

      next: (tickets) => {

        console.log(
          '🎫 MES TICKETS :',
          tickets
        );

        this.nombreTickets =
          tickets?.length || 0;

        this.chargementTickets = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération tickets :',
          error
        );

        this.erreurTickets = true;

        this.chargementTickets = false;

      }

    });

  }

  // =====================================================
  // CHARGER LES NOTIFICATIONS
  // =====================================================

  chargerNotifications(): void {

    this.chargementNotifications = true;

    this.erreurNotifications = false;

    this.http.get<NotificationUser[]>(
      `${this.API_URL}/notifications`
    )
    .subscribe({

      next: (notifications) => {

        console.log(
          '🔔 MES NOTIFICATIONS :',
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

        this.erreurNotifications = true;

        this.chargementNotifications = false;

      }

    });

  }

  // =====================================================
  // CALCULER NOTIFICATIONS NON LUES
  // =====================================================

  calculerNotificationsNonLues(): void {

    this.notificationsNonLues =
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

    // Si on ouvre le panneau,
    // on actualise les notifications.

    if (this.afficherNotifications) {

      this.chargerNotifications();

    }

  }

  // =====================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // =====================================================

  marquerNotificationCommeLue(
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
          '✅ Notification marquée comme lue :',
          notificationModifiee
        );

        notification.lu = true;

        this.calculerNotificationsNonLues();

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

    if (this.notificationsNonLues === 0) {
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

        this.notificationsNonLues = 0;

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
  // TYPE NOTIFICATION
  // =====================================================

  getNotificationIcon(type?: string): string {

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

  getNotificationClass(type?: string): string {

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
  // LIBELLÉ TYPE NOTIFICATION
  // =====================================================

  getNotificationType(type?: string): string {

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

    const dateNotification =
      new Date(date);

    return dateNotification.toLocaleDateString(
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
  // NOM COMPLET
  // =====================================================

  get nomComplet(): string {

    const nom =
      `${this.prenomUtilisateur} ${this.nomUtilisateur}`
        .trim();

    return nom || 'Utilisateur';

  }

  // =====================================================
  // INITIALES
  // =====================================================

  get initiales(): string {

    const prenom =
      this.prenomUtilisateur?.charAt(0) || '';

    const nom =
      this.nomUtilisateur?.charAt(0) || '';

    return (
      prenom + nom
    ).toUpperCase();

  }

  // =====================================================
  // NAVIGATION VOYAGES
  // =====================================================

  allerVoyages(): void {

    this.router.navigate([
      '/voyages'
    ]);

  }

  // =====================================================
  // NAVIGATION RESERVATIONS
  // =====================================================

  allerReservations(): void {

    this.router.navigate([
      '/reservations-user'
    ]);

  }

  // =====================================================
  // NAVIGATION TICKETS
  // =====================================================

  allerTickets(): void {

    this.router.navigate([
      '/tickets-user'
    ]);

  }

  // =====================================================
  // NAVIGATION PAIEMENTS
  // =====================================================

  allerPaiements(): void {

    this.router.navigate([
      '/paiements-user'
    ]);

  }

  // =====================================================
  // NAVIGATION PROFIL
  // =====================================================

  allerProfil(): void {

    this.router.navigate([
      '/profil'
    ]);

  }

  // =====================================================
  // DECONNEXION
  // =====================================================

  deconnexion(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}