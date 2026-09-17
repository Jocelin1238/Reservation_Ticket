import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { TrajetService } from '../../services/trajet.service';
import { Trajet } from '../../models/trajet';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
interface Ville {
  id: number;
  nom: string;
  actif: boolean;
}
@Component({
  selector: 'app-trajet',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    MatIconModule
  ],

  templateUrl: './trajet.component.html',
  styleUrl: './trajet.component.css'
})

export class TrajetComponent implements OnInit {
villes: Ville[] = [];

chargementVilles = false;
  trajets: Trajet[] = [];

  afficherFormulaire = false;

  modeModification = false;

  trajet: Trajet = this.nouveauTrajet();

  constructor(
    private trajetService: TrajetService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.chargerTrajets();
this.chargerVilles();

  }

  // =====================================
  // TRAJET VIDE
  // =====================================

  nouveauTrajet(): Trajet {

    return {

      villeDepart: '',

      villeArrivee: '',

      distance: 0,

      duree: 0

    };

  }

  // =====================================
  // CHARGER LES TRAJETS
  // =====================================

  chargerTrajets(): void {

    this.trajetService.getAllTrajets().subscribe({

      next: (data) => {

        this.trajets = data;

      },

      error: (error) => {

        console.error(
          'Erreur chargement trajets :',
          error
        );

      }

    });

  }

  // =====================================
  // OUVRIR AJOUT
  // =====================================

  ouvrirAjout(): void {

    this.trajet = this.nouveauTrajet();

    this.modeModification = false;

    this.afficherFormulaire = true;

  }

  // =====================================
  // MODIFIER
  // =====================================

  modifierTrajet(trajet: Trajet): void {

    this.trajet = {
      ...trajet
    };

    this.modeModification = true;

    this.afficherFormulaire = true;

  }

  // =====================================
  // ENREGISTRER
  // =====================================

  enregistrerTrajet(): void {

  if (
    !this.trajet.villeDepart ||
    !this.trajet.villeArrivee
  ) {

    alert(
      'Veuillez sélectionner la ville de départ et la ville d’arrivée.'
    );

    return;

  }


  if (
    this.trajet.villeDepart
      .trim()
      .toLowerCase() ===
    this.trajet.villeArrivee
      .trim()
      .toLowerCase()
  ) {

    alert(
      'La ville de départ et la ville d’arrivée doivent être différentes.'
    );

    return;

  }


  if (
    this.trajet.distance === undefined ||
    this.trajet.distance < 0
  ) {

    alert(
      'La distance est invalide.'
    );

    return;

  }


  if (
    this.trajet.duree === undefined ||
    this.trajet.duree < 0
  ) {

    alert(
      'La durée est invalide.'
    );

    return;

  }


  // ==============================
  // MODIFICATION
  // ==============================

  if (
    this.modeModification &&
    this.trajet.id
  ) {

    this.trajetService
      .modifierTrajet(
        this.trajet.id,
        this.trajet
      )
      .subscribe({

        next: () => {

          alert(
            'Trajet modifié avec succès.'
          );

          this.fermerFormulaire();

          this.chargerTrajets();

        },

        error: (error) => {

          console.error(
            '❌ Erreur modification :',
            error
          );

          alert(
            error?.error?.message ||
            'Erreur lors de la modification.'
          );

        }

      });

    return;
  }


  // ==============================
  // AJOUT
  // ==============================

  this.trajetService
    .ajouterTrajet(this.trajet)
    .subscribe({

      next: () => {

        alert(
          'Trajet ajouté avec succès.'
        );

        this.fermerFormulaire();

        this.chargerTrajets();

      },

      error: (error) => {

        console.error(
          '❌ Erreur ajout :',
          error
        );

        alert(
          error?.error?.message ||
          'Erreur lors de l’ajout.'
        );

      }

    });

}

  // =====================================
  // SUPPRIMER
  // =====================================

  supprimerTrajet(
    id: number | undefined
  ): void {

    if (!id) {

      return;

    }

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer ce trajet ?'
    );

    if (!confirmation) {

      return;

    }

    this.trajetService
      .supprimerTrajet(id)
      .subscribe({

        next: () => {

          alert(
            'Trajet supprimé avec succès'
          );

          this.chargerTrajets();

        },

        error: (error) => {

          console.error(error);

          alert(
            'Erreur lors de la suppression'
          );

        }

      });

  }

  // =====================================
  // FERMER FORMULAIRE
  // =====================================

  fermerFormulaire(): void {

    this.afficherFormulaire = false;

    this.modeModification = false;

    this.trajet = this.nouveauTrajet();

  }

  // =====================================
  // STATISTIQUES
  // =====================================

  distanceTotale(): number {

    return this.trajets.reduce(
      (total, trajet) =>
        total + (trajet.distance || 0),
      0
    );

  }

  dureeTotale(): number {

    return this.trajets.reduce(
      (total, trajet) =>
        total + (trajet.duree || 0),
      0
    );

  }

  // =====================================
  // FORMATAGE DUREE
  // =====================================

  formaterDuree(
    minutes: number | undefined
  ): string {

    if (!minutes) {

      return '0 min';

    }

    const heures =
      Math.floor(minutes / 60);

    const reste =
      minutes % 60;

    if (heures === 0) {

      return `${reste} min`;

    }

    if (reste === 0) {

      return `${heures} h`;

    }

    return `${heures} h ${reste} min`;

  }
  chargerVilles(): void {

  this.chargementVilles = true;

  this.http
    .get<Ville[]>(
      'http://localhost:8080/api/villes'
    )
    .subscribe({

      next: (data) => {

        console.log(
          '🏙️ VILLES :',
          data
        );

        this.villes = data || [];

        this.chargementVilles = false;

      },

      error: (error) => {

        console.error(
          '❌ Erreur chargement villes :',
          error
        );

        this.chargementVilles = false;

      }

    });

}

}