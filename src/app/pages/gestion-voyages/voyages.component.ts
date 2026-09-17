
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VoyageService } from '../../services/voyage.service';
import { TrajetService } from '../../services/trajet.service';
import { ConfortService } from '../../services/confort';
import { AuthService } from '../../services/auth';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { MatIconModule } from '@angular/material/icon';
import { SidebarStaffComponent } from '../../components/sidebar-staff/sidebar-staff.component';
import { TopbarStaffComponent } from '../../components/topbar-staff/topbar-staff.component';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';
@Component({
  selector: 'app-voyages',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
     SidebarStaffComponent,
  TopbarStaffComponent,

    MatIconModule,
    SidebarAdminComponent
  ],

  templateUrl: './voyages.component.html',
  styleUrl: './voyages.component.css'
})
export class VoyagesComponent implements OnInit {

  // =====================================================
  // LISTES
  // =====================================================

  voyages: any[] = [];

  trajets: any[] = [];

  conforts: any[] = [];


  // =====================================================
  // ROLE UTILISATEUR
  // =====================================================

  roleUtilisateur = '';

  peutGererVoyages = false;


  // =====================================================
  // FORMULAIRE
  // =====================================================

  afficherFormulaire = false;

  modeModification = false;

  voyageId?: number;


  // =====================================================
  // VOYAGE
  // =====================================================

  voyage: any = this.nouveauVoyage();


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private voyageService: VoyageService,
    private trajetService: TrajetService,
    private confortService: ConfortService,
    private authService: AuthService
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    // Récupération du rôle connecté
    this.roleUtilisateur =
      this.authService.getUserRole();

    console.log(
      '👤 Rôle connecté :',
      this.roleUtilisateur
    );


    // ===================================================
    // DROITS DE GESTION
    // ===================================================

    this.peutGererVoyages =
      this.roleUtilisateur === 'ROLE_ADMIN' ||
      this.roleUtilisateur === 'ROLE_SUPER_ADMIN';


    console.log(
      '🔐 Peut gérer les voyages :',
      this.peutGererVoyages
    );


    // ===================================================
    // CHARGEMENT
    // ===================================================

    this.chargerVoyages();

    /*
     * Les trajets et les conforts sont nécessaires
     * uniquement pour le formulaire d'ajout/modification.
     *
     * Le Staff n'en a donc pas besoin.
     */

    if (this.peutGererVoyages) {

      this.chargerTrajets();

      this.chargerConforts();

    }

  }


  // =====================================================
  // NOUVEAU VOYAGE
  // =====================================================

  nouveauVoyage(): any {

    return {

      numeroVoyage: '',

      dateDepart: '',
      heureDepart: '',

      dateArrivee: '',
      heureArrivee: '',

      prix: 0,

      nombrePlaces: 50,

      placesDisponibles: 50,

      statut: 'DISPONIBLE',

      description: '',

      trajet: {
        id: null
      },

      confort: {
        id: null
      }

    };

  }


  // =====================================================
  // CHARGER LES VOYAGES
  // =====================================================

  chargerVoyages(): void {

    this.voyageService
      .getAllVoyages()
      .subscribe({

        next: (data) => {

          console.log(
            '📋 Liste des voyages :',
            data
          );

          this.voyages = data ?? [];

        },

        error: (err) => {

          console.error(
            '❌ Erreur chargement voyages :',
            err
          );

        }

      });

  }


  // =====================================================
  // CHARGER LES TRAJETS
  // =====================================================

  chargerTrajets(): void {

    if (!this.peutGererVoyages) {
      return;
    }

    this.trajetService
      .getAllTrajets()
      .subscribe({

        next: (data) => {

          console.log(
            '🛣️ Trajets :',
            data
          );

          this.trajets = data ?? [];

        },

        error: (err) => {

          console.error(
            '❌ Erreur chargement trajets :',
            err
          );

        }

      });

  }


  // =====================================================
  // CHARGER LES CONFORTS
  // =====================================================

  chargerConforts(): void {

    if (!this.peutGererVoyages) {
      return;
    }

    this.confortService
      .getAllConforts()
      .subscribe({

        next: (data) => {

          console.log(
            '🛋️ Conforts :',
            data
          );

          this.conforts = data ?? [];

        },

        error: (err) => {

          console.error(
            '❌ Erreur chargement conforts :',
            err
          );

        }

      });

  }


  // =====================================================
  // OUVRIR AJOUT
  // =====================================================

ouvrirAjout(): void {

  if (!this.peutGererVoyages) {

    console.warn(
      '⛔ Le Staff ne peut pas ajouter un voyage.'
    );

    return;
  }

  // Recharger les trajets pour avoir
  // les derniers itinéraires créés
  this.chargerTrajets();

  // Recharger aussi les conforts
  this.chargerConforts();

  this.voyage = this.nouveauVoyage();

  this.voyageId = undefined;

  this.modeModification = false;

  this.afficherFormulaire = true;

}

  // =====================================================
  // MODIFIER UN VOYAGE
  // =====================================================

  modifierVoyage(v: any): void {

    if (!this.peutGererVoyages) {

      console.warn(
        '⛔ Le Staff ne peut pas modifier un voyage.'
      );

      return;

    }


    console.log(
      '✏️ Modification voyage :',
      v
    );


    this.voyageId = v.id;

    this.modeModification = true;

    this.afficherFormulaire = true;


    this.voyage = {

      id: v.id,

      numeroVoyage: v.numeroVoyage,

      dateDepart: v.dateDepart,
      heureDepart: v.heureDepart,

      dateArrivee: v.dateArrivee,
      heureArrivee: v.heureArrivee,

      prix: v.prix,

      nombrePlaces: v.nombrePlaces,

      placesDisponibles: v.placesDisponibles,

      statut: v.statut,

      description: v.description ?? '',


      // API retourne trajetId
      trajet: {
        id: v.trajetId ?? v.trajet?.id ?? null
      },


      // API retourne confortId
      confort: {
        id: v.confortId ?? v.confort?.id ?? null
      }

    };

  }


  // =====================================================
  // CHANGEMENT DU NOMBRE DE PLACES
  // =====================================================

  changerNombrePlaces(): void {

    if (!this.modeModification) {

      this.voyage.placesDisponibles =
        this.voyage.nombrePlaces || 0;

    }

  }


  // =====================================================
  // ENREGISTRER
  // =====================================================

  enregistrerVoyage(): void {

    // ===================================================
    // SÉCURITÉ FRONTEND
    // ===================================================

    if (!this.peutGererVoyages) {

      alert(
        'Vous n\'avez pas les droits nécessaires pour gérer les voyages.'
      );

      return;

    }


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.voyage.numeroVoyage ||
      !this.voyage.dateDepart ||
      !this.voyage.heureDepart ||
      !this.voyage.dateArrivee ||
      !this.voyage.heureArrivee ||
      this.voyage.prix <= 0 ||
      this.voyage.nombrePlaces <= 0
    ) {

      alert(
        'Veuillez remplir correctement tous les champs obligatoires.'
      );

      return;

    }


    // ===================================================
    // VÉRIFICATION DES DATES
    // ===================================================

    const depart = new Date(
      `${this.voyage.dateDepart}T${this.voyage.heureDepart}`
    );

    const arrivee = new Date(
      `${this.voyage.dateArrivee}T${this.voyage.heureArrivee}`
    );


    if (arrivee <= depart) {

      alert(
        'La date et l’heure d’arrivée doivent être après le départ.'
      );

      return;

    }


    // ===================================================
    // VÉRIFICATION TRAJET
    // ===================================================

    if (!this.voyage.trajet?.id) {

      alert(
        'Veuillez sélectionner un trajet.'
      );

      return;

    }


    // ===================================================
    // CONSTRUCTION DU PAYLOAD
    // ===================================================

    const payload = {

      numeroVoyage:
        this.voyage.numeroVoyage,

      dateDepart:
        this.voyage.dateDepart,

      heureDepart:
        this.voyage.heureDepart,

      dateArrivee:
        this.voyage.dateArrivee,

      heureArrivee:
        this.voyage.heureArrivee,

      prix:
        this.voyage.prix,

      nombrePlaces:
        this.voyage.nombrePlaces,

      placesDisponibles:
        this.voyage.placesDisponibles,

      statut:
        this.voyage.statut,

      description:
        this.voyage.description,

      trajet: {
        id: this.voyage.trajet.id
      },

      confort:
        this.voyage.confort?.id
          ? {
              id: this.voyage.confort.id
            }
          : null

    };


    console.log(
      '📤 Données envoyées :',
      payload
    );


    // ===================================================
    // MODIFICATION
    // ===================================================

    if (
      this.modeModification &&
      this.voyageId
    ) {

      this.voyageService
        .modifierVoyage(
          this.voyageId,
          payload
        )
        .subscribe({

          next: (response) => {

            console.log(
              '✅ Voyage modifié :',
              response
            );

            alert(
              'Voyage modifié avec succès.'
            );

            this.fermerFormulaire();

            this.chargerVoyages();

          },

          error: (err) => {

            console.error(
              '❌ Erreur modification :',
              err
            );

            alert(
              'Erreur lors de la modification du voyage.'
            );

          }

        });

      return;

    }


    // ===================================================
    // AJOUT
    // ===================================================

    this.voyageService
      .ajouterVoyage(payload)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Voyage ajouté :',
            response
          );

          alert(
            'Voyage ajouté avec succès.'
          );

          this.fermerFormulaire();

          this.chargerVoyages();

        },

        error: (err) => {

          console.error(
            '❌ Erreur ajout voyage :',
            err
          );

          alert(
            'Erreur lors de l’ajout du voyage.'
          );

        }

      });

  }


  // =====================================================
  // SUPPRIMER
  // =====================================================

  supprimerVoyage(
    id: number | undefined
  ): void {

    if (!this.peutGererVoyages) {

      console.warn(
        '⛔ Le Staff ne peut pas supprimer un voyage.'
      );

      return;

    }


    if (!id) {
      return;
    }


    const confirmation = confirm(
      'Voulez-vous vraiment supprimer ce voyage ?'
    );


    if (!confirmation) {
      return;
    }


    this.voyageService
      .supprimerVoyage(id)
      .subscribe({

        next: () => {

          alert(
            'Voyage supprimé avec succès.'
          );

          this.chargerVoyages();

        },

        error: (err) => {

          console.error(
            '❌ Erreur suppression voyage :',
            err
          );

          alert(
            'Erreur lors de la suppression du voyage.'
          );

        }

      });

  }


  // =====================================================
  // FERMER FORMULAIRE
  // =====================================================

  fermerFormulaire(): void {

    this.afficherFormulaire = false;

    this.modeModification = false;

    this.voyageId = undefined;

    this.voyage = this.nouveauVoyage();

  }
// =====================================================
// PERMISSIONS
// =====================================================

get peutModifierVoyage(): boolean {

  const role = this.authService.getUserRole();

  return (
    role === 'ROLE_ADMIN' ||
    role === 'ROLE_SUPER_ADMIN'
  );

}

}

