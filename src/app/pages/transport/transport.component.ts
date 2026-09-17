import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { TransportService } from '../../services/transport.service';
import { Transport } from '../../models/transport';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transport',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
     MatIconModule
  ],

  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css'
})
export class TransportComponent implements OnInit {

  transports: Transport[] = [];

  afficherFormulaire = false;

  modeModification = false;

  transport: Transport = this.nouveauTransport();

  constructor(
    private transportService: TransportService
  ) {}


  ngOnInit(): void {

    this.chargerTransports();

  }


  // =====================================
  // TRANSPORT VIDE
  // =====================================

  nouveauTransport(): Transport {

    return {

      nom: '',

      type: 'BUS',

      capacite: 0,

      statut: 'ACTIF'

    };

  }


  // =====================================
  // CHARGER LES TRANSPORTS
  // =====================================

  chargerTransports(): void {

    this.transportService.getAll().subscribe({

      next: (data) => {

        this.transports = data;

      },

      error: (error) => {

        console.error(
          'Erreur chargement transports :',
          error
        );

      }

    });

  }


  // =====================================
  // OUVRIR AJOUT
  // =====================================

  ouvrirAjout(): void {

    this.transport = this.nouveauTransport();

    this.modeModification = false;

    this.afficherFormulaire = true;

  }


  // =====================================
  // MODIFIER
  // =====================================

  modifierTransport(
    transport: Transport
  ): void {

    this.transport = {
      ...transport
    };

    this.modeModification = true;

    this.afficherFormulaire = true;

  }


  // =====================================
  // ENREGISTRER
  // =====================================

  enregistrerTransport(): void {

    if (
      !this.transport.nom ||
      !this.transport.capacite
    ) {

      alert('Veuillez remplir tous les champs.');

      return;

    }


    // MODIFICATION

    if (
      this.modeModification &&
      this.transport.id
    ) {

      this.transportService
        .modifier(
          this.transport.id,
          this.transport
        )
        .subscribe({

          next: () => {

            alert(
              'Transport modifié avec succès'
            );

            this.fermerFormulaire();

            this.chargerTransports();

          },

          error: (error) => {

            console.error(error);

            alert(
              'Erreur lors de la modification'
            );

          }

        });

    }

    // AJOUT

    else {

      this.transportService
        .ajouter(this.transport)
        .subscribe({

          next: () => {

            alert(
              'Transport ajouté avec succès'
            );

            this.fermerFormulaire();

            this.chargerTransports();

          },

          error: (error) => {

            console.error(error);

            alert(
              'Erreur lors de l’ajout'
            );

          }

        });

    }

  }


  // =====================================
  // SUPPRIMER
  // =====================================

  supprimerTransport(
    id: number | undefined
  ): void {

    if (!id) {

      return;

    }


    const confirmation =
      confirm(
        'Voulez-vous vraiment supprimer ce transport ?'
      );


    if (!confirmation) {

      return;

    }


    this.transportService
      .supprimer(id)
      .subscribe({

        next: () => {

          alert(
            'Transport supprimé avec succès'
          );

          this.chargerTransports();

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

    this.transport = this.nouveauTransport();

  }


  // =====================================
  // COMPTER PAR TYPE
  // =====================================

  compterType(
    type: 'BUS' | 'AVION' | 'TRAIN'
  ): number {

    return this.transports.filter(
      t => t.type === type
    ).length;

  }


  // =====================================
  // CAPACITE TOTALE
  // =====================================

  capaciteTotale(): number {

    return this.transports.reduce(
      (total, transport) =>
        total + (transport.capacite || 0),
      0
    );

  }

}