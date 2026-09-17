import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';

import {
  TransportService
} from '../../services/transport.service';

import { Transport } from '../../models/transport';

import {
  NotificationService,
  Notification
} from '../../services/notification.service';


/* =====================================================
   INTERFACE VOYAGE DEMO
===================================================== */

interface Trip {

  id: number;

  companyName: string;

  tripType: string;

  status: 'VALIDÉ' | 'EN ATTENTE';

  departureTime: string;

  departureCity: string;

  arrivalTime: string;

  arrivalCity: string;

  duration: string;

  price: number;

}


/* =====================================================
   COMPOSANT ACCUEIL
===================================================== */

@Component({

  selector: 'app-accueil',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './accueil.component.html',

  styleUrls: [
    './accueil.component.css'
  ]

})
export class AccueilComponent implements OnInit {


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
     MENU NOTIFICATIONS
  ====================================================== */

  menuNotificationsOuvert = false;

  notifications: Notification[] = [];

  nombreNotifications = 0;

  chargementNotifications = false;


  /* =====================================================
     RECHERCHE VOYAGE
  ====================================================== */

  searchQuery = {

    departure: '',

    destination: '',

    date: '',

    transport: ''

  };


  /* =====================================================
     TRANSPORTS
  ====================================================== */

  transports: Transport[] = [];

  chargementTransports = false;


  /* =====================================================
     VOYAGES DE DÉMONSTRATION
  ====================================================== */

  availableTrips: Trip[] = [

    {

      id: 1,

      companyName: 'Compagnie Azur',

      tripType: 'Trajet Direct • Confort Business',

      status: 'VALIDÉ',

      departureTime: '08:00',

      departureCity: 'Paris',

      arrivalTime: '12:30',

      arrivalCity: 'Lyon',

      duration: '4h 30m',

      price: 45.00

    },


    {

      id: 2,

      companyName: 'RapidExpress Rail',

      tripType: 'Trajet Express • Confort Standard',

      status: 'EN ATTENTE',

      departureTime: '10:15',

      departureCity: 'Marseille',

      arrivalTime: '12:30',

      arrivalCity: 'Nice',

      duration: '2h 15m',

      price: 32.50

    },


    {

      id: 3,

      companyName: 'Océan Lignes',

      tripType: 'Trajet Panoramique • Premium Bus',

      status: 'VALIDÉ',

      departureTime: '07:45',

      departureCity: 'Bordeaux',

      arrivalTime: '13:55',

      arrivalCity: 'Nantes',

      duration: '6h 10m',

      price: 19.00

    }

  ];


  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor(

    private authService: AuthService,

    private router: Router,

    private transportService: TransportService,

    private notificationService: NotificationService

  ) {}


  /* =====================================================
     INITIALISATION
  ====================================================== */

  ngOnInit(): void {

    /* ===============================================
       UTILISATEUR
    =============================================== */

    this.estConnecte =
      this.authService.isLoggedIn();

    this.roleUtilisateur =
      this.authService.getUserRole();


    console.log(
      '=============================='
    );

    console.log(
      '🏠 ACCUEIL'
    );

    console.log(
      '🔐 Connecté :',
      this.estConnecte
    );

    console.log(
      '👤 Rôle :',
      this.roleUtilisateur
    );

    console.log(
      '=============================='
    );


    /* ===============================================
       CHARGER LES TRANSPORTS
    =============================================== */

    this.chargerTransports();


    /* ===============================================
       CHARGER LES NOTIFICATIONS
    =============================================== */

    if (this.estConnecte) {

      this.chargerNotifications();

    }

  }


  /* =====================================================
     RECHERCHE DE VOYAGE
  ====================================================== */

  onSearch(): void {

    const departure =
      this.searchQuery.departure?.trim() || '';

    const destination =
      this.searchQuery.destination?.trim() || '';

    const date =
      this.searchQuery.date || '';

    const transport =
      this.searchQuery.transport || '';


    /* ===============================================
       VALIDATION DÉPART
    =============================================== */

    if (!departure) {

      alert(
        'Veuillez sélectionner la ville de départ.'
      );

      return;

    }


    /* ===============================================
       VALIDATION ARRIVÉE
    =============================================== */

    if (!destination) {

      alert(
        'Veuillez sélectionner la ville d’arrivée.'
      );

      return;

    }


    /* ===============================================
       DÉPART ≠ ARRIVÉE
    =============================================== */

    if (
      departure.toLowerCase() ===
      destination.toLowerCase()
    ) {

      alert(
        'La ville de départ et la ville d’arrivée doivent être différentes.'
      );

      return;

    }


    /* ===============================================
       VALIDATION DATE
    =============================================== */

    if (!date) {

      alert(
        'Veuillez choisir la date du voyage.'
      );

      return;

    }


    console.log(
      '=============================='
    );

    console.log(
      '🔎 RECHERCHE VOYAGE'
    );

    console.log(
      '📍 Départ :',
      departure
    );

    console.log(
      '📍 Arrivée :',
      destination
    );

    console.log(
      '📅 Date :',
      date
    );

    console.log(
      '🚌 Transport :',
      transport
    );

    console.log(
      '=============================='
    );


    this.router.navigate(

      ['/voyages'],

      {

        queryParams: {

          depart: departure,

          arrivee: destination,

          date: date,

          transportId: transport

        }

      }

    );

  }


  /* =====================================================
     RESERVATION DEMO
  ====================================================== */

  onReserve(trip: Trip): void {

    console.log(
      'Réservation du voyage :',
      trip
    );

  }


  /* =====================================================
     CONNEXION
  ====================================================== */

  allerConnexion(): void {

    this.router.navigate([
      '/login'
    ]);

  }


  /* =====================================================
     DASHBOARD
  ====================================================== */

  allerDashboard(): void {

    if (!this.estConnecte) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/dashboard-user'
        ]);

        break;


      case 'ROLE_ADMIN':

        this.router.navigate([
          '/dashboard-admin'
        ]);

        break;


      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/accueil'
        ]);

        break;


      case 'ROLE_STAFF':

        this.router.navigate([
          '/dashboard-staff'
        ]);

        break;


      default:

        console.warn(
          '⚠️ Rôle sans dashboard :',
          this.roleUtilisateur
        );

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


    if (
      this.roleUtilisateur ===
      'ROLE_USER'
    ) {

      this.router.navigate([
        '/reservations-user'
      ]);

      return;

    }


    if (
      this.roleUtilisateur === 'ROLE_STAFF' ||
      this.roleUtilisateur === 'ROLE_ADMIN' ||
      this.roleUtilisateur === 'ROLE_SUPER_ADMIN'
    ) {

      this.router.navigate([
        '/reservations'
      ]);

      return;

    }


    console.warn(
      '⚠️ Aucun accès réservations pour :',
      this.roleUtilisateur
    );

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
     NAVIGATION VOYAGES
  ====================================================== */

  allerAuxVoyages(): void {

    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/voyages'
        ]);

        break;


      case 'ROLE_ADMIN':

        this.router.navigate([
          '/admin/voyages'
        ]);

        break;


      case 'ROLE_SUPER_ADMIN':

        this.router.navigate([
          '/admin/voyages'
        ]);

        break;


      case 'ROLE_STAFF':

        this.router.navigate([
          '/gestion-voyages'
        ]);

        break;


      default:

        this.router.navigate([
          '/voyages'
        ]);

        break;

    }

  }


  /* =====================================================
     CHARGER LES TRANSPORTS
  ====================================================== */

  chargerTransports(): void {

    this.chargementTransports = true;

    this.transportService.getAll().subscribe({

      next: (data) => {

        console.log(
          '🚌 TRANSPORTS REÇUS :',
          data
        );

        this.transports =
          data || [];

        this.chargementTransports =
          false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération transports :',
          error
        );

        this.transports = [];

        this.chargementTransports =
          false;

      }

    });

  }


  /* =====================================================
     OUVRIR / FERMER LE MENU PROFIL
  ====================================================== */

  toggleMenuProfil(): void {

    this.menuProfilOuvert =
      !this.menuProfilOuvert;

    if (this.menuProfilOuvert) {

      this.menuNotificationsOuvert =
        false;

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

    this.menuProfilOuvert =
      false;

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
        '/login'
      ]);

      return;

    }

    this.menuProfilOuvert =
      false;


    switch (this.roleUtilisateur) {

      case 'ROLE_USER':

        this.router.navigate([
          '/parametres'
        ]);

        break;


      case 'ROLE_STAFF':

        this.router.navigate([
          '/staff/parametres'
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
          '/login'
        ]);

        break;

    }

  }


  /* =====================================================
     DÉCONNEXION
  ====================================================== */

  seDeconnecter(): void {

    this.menuProfilOuvert =
      false;

    this.menuNotificationsOuvert =
      false;

    this.authService.logout();

    this.estConnecte =
      false;

    this.roleUtilisateur =
      '';

    this.notifications =
      [];

    this.nombreNotifications =
      0;

    this.router.navigate([
      '/login'
    ]);

  }


  /* =====================================================
     DÉCONNEXION
  ===================================================== */

  deconnexion(): void {

    this.seDeconnecter();

  }


  /* =====================================================
     NOTIFICATIONS
  ====================================================== */

  chargerNotifications(): void {

    if (!this.estConnecte) {

      return;

    }

    this.chargementNotifications =
      true;


    this.notificationService
      .getNotifications()
      .subscribe({

        next: (data) => {

          console.log(
            '🔔 NOTIFICATIONS :',
            data
          );

          this.notifications =
            data || [];

          this.chargementNotifications =
            false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération notifications :',
            error
          );

          this.notifications =
            [];

          this.chargementNotifications =
            false;

        }

      });


    /* ===============================================
       NOMBRE NON LUES
    =============================================== */

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

          this.nombreNotifications =
            0;

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


    if (this.menuNotificationsOuvert) {

      this.menuProfilOuvert =
        false;

      this.chargerNotifications();

    }

  }


  /* =====================================================
     MARQUER UNE NOTIFICATION COMME LUE
  ====================================================== */

  marquerNotificationCommeLue(
    notification: Notification
  ): void {

    if (!notification || notification.lu) {

      return;

    }

    this.notificationService
      .marquerCommeLue(notification.id)
      .subscribe({

        next: (notificationModifiee) => {

          notification.lu =
            notificationModifiee.lu;

          this.nombreNotifications =
            Math.max(
              0,
              this.nombreNotifications - 1
            );

        },

        error: (error) => {

          console.error(
            '❌ Erreur notification :',
            error
          );

        }

      });

  }


  /* =====================================================
     MARQUER TOUTES COMME LUES
  ====================================================== */

  marquerToutesCommeLues(): void {

    if (!this.estConnecte) {

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

          this.nombreNotifications =
            0;

        },

        error: (error) => {

          console.error(
            '❌ Erreur marquage notifications :',
            error
          );

        }

      });

  }


  /* =====================================================
     SUPPRIMER UNE NOTIFICATION
  ====================================================== */

 supprimerNotification(
  id: number,
  notification?: Notification
): void {

  console.log('🗑️ Suppression notification :', id);

  this.notificationService
    .supprimerNotification(id)
    .subscribe({

      next: () => {

        console.log(
          '✅ Notification supprimée'
        );

        // Retirer la notification de la liste
        this.notifications =
          this.notifications.filter(
            n => n.id !== id
          );

        // Recalculer le nombre de notifications non lues
        this.nombreNotifications =
          this.notifications.filter(
            n => !n.lu
          ).length;

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
     ICÔNE NOTIFICATION
  ====================================================== */

  getNotificationIcon(
    type: string
  ): string {

    switch (type) {

      case 'RESERVATION':

        return 'confirmation_number';


      case 'PAIEMENT':

        return 'payments';


      case 'VOYAGE':

        return 'directions_bus';


      case 'UTILISATEUR':

        return 'person';


      case 'SYSTEME':

        return 'notifications';


      default:

        return 'notifications';

    }

  }


  /* =====================================================
     FORMATAGE DATE NOTIFICATION
  ====================================================== */

  formaterDate(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    const dateNotification =
      new Date(date);


    if (isNaN(
      dateNotification.getTime()
    )) {

      return date;

    }


    return dateNotification.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ) + ' à ' +
    dateNotification.toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

}