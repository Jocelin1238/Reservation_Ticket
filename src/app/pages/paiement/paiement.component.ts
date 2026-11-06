import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';
import {
PaiementService,
Paiement
} from '../../services/paiement.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AuthService } from '../../services/auth';

@Component({
selector: 'app-paiement',
standalone: true,

imports: [
CommonModule,
FormsModule,
MatIconModule,
 SidebarComponent,
  TopbarComponent,
  SidebarAdminComponent 
],

templateUrl: './paiement.component.html',
styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {

paiements: Paiement[] = [];
paiementsFiltres: Paiement[] = [];

recherche = '';
statutFiltre = 'TOUS';
methodeFiltre = 'TOUTES';

chargement = false;
erreur = '';

paiementSelectionne: Paiement | null = null;
detailsOuverts = false;

validationEnCours = false;

  roleUtilisateur = '';
constructor(
private paiementService: PaiementService,
private authService: AuthService
) {}

ngOnInit(): void {
  // Récupération du rôle connecté
    this.roleUtilisateur =
      this.authService.getUserRole();

    console.log(
      '👤 Rôle connecté :',
      this.roleUtilisateur
    );
this.chargerPaiements();
}

// =========================
// CHARGER LES PAIEMENTS
// =========================

chargerPaiements(): void {


this.chargement = true;
this.erreur = '';

this.paiementService
  .getAllPaiements()
  .subscribe({

    next: (data) => {

      console.log(
        'Paiements reçus :',
        data
      );

      this.paiements = data;

      this.paiementsFiltres = data;

      this.chargement = false;

    },

    error: (error) => {

      console.error(
        'Erreur chargement paiements :',
        error
      );

      this.erreur =
        'Impossible de charger les paiements.';

      this.chargement = false;

    }

  });


}

// =========================
// FILTRAGE
// =========================

filtrerPaiements(): void {


const recherche =
  this.recherche
    .toLowerCase()
    .trim();


this.paiementsFiltres =
  this.paiements.filter(paiement => {

    const reference =
      paiement.referenceTransaction
        ?.toLowerCase() || '';

    const methode =
      paiement.methode
        ?.toLowerCase() || '';

    const statut =
      paiement.statut
        ?.toLowerCase() || '';


    const correspondRecherche =
      !recherche ||
      reference.includes(recherche) ||
      methode.includes(recherche);


    const correspondStatut =
      this.statutFiltre === 'TOUS' ||
      paiement.statut === this.statutFiltre;


    const correspondMethode =
      this.methodeFiltre === 'TOUTES' ||
      paiement.methode === this.methodeFiltre;


    return (
      correspondRecherche &&
      correspondStatut &&
      correspondMethode
    );

  });


}

// =========================
// CHANGEMENT FILTRE
// =========================

changerStatutFiltre(): void {
this.filtrerPaiements();
}

changerMethodeFiltre(): void {
this.filtrerPaiements();
}

// =========================
// STATISTIQUES
// =========================

getNombreTotal(): number {
return this.paiements.length;
}

getNombreReussis(): number {


return this.paiements.filter(
  p => p.statut === 'REUSSI'
).length;


}

getNombreEnCours(): number {


return this.paiements.filter(
  p => p.statut === 'EN_COURS'
).length;


}

getNombreEchecs(): number {


return this.paiements.filter(
  p => p.statut === 'ECHEC'
).length;


}

// =========================
// TOTAL REVENUS
// =========================

getTotalRevenus(): number {


return this.paiements
  .filter(
    p => p.statut === 'REUSSI'
  )
  .reduce(
    (total, p) =>
      total + (p.montant || 0),
    0
  );


}

// =========================
// DÉTAILS
// =========================

ouvrirDetails(
paiement: Paiement
): void {


this.paiementSelectionne =
  paiement;

this.detailsOuverts = true;


}

fermerDetails(): void {


this.detailsOuverts = false;

this.paiementSelectionne =
  null;

}

// =========================
// VALIDER PAIEMENT
// =========================

validerPaiement(
paiement: Paiement
): void {


if (
  paiement.statut !== 'EN_COURS'
) {
  return;
}


this.validationEnCours = true;


this.paiementService
  .validerPaiement(paiement.id)
  .subscribe({

    next: (paiementMisAJour) => {

      const index =
        this.paiements.findIndex(
          p => p.id === paiement.id
        );


      if (index !== -1) {

        this.paiements[index] =
          paiementMisAJour;

      }


      this.filtrerPaiements();


      if (
        this.paiementSelectionne?.id
        === paiement.id
      ) {

        this.paiementSelectionne =
          paiementMisAJour;

      }


      this.validationEnCours =
        false;

    },

    error: (error) => {

      console.error(
        'Erreur validation paiement :',
        error
      );

      this.erreur =
        'Impossible de valider le paiement.';

      this.validationEnCours =
        false;

    }

  });


}

// =========================
// FORMAT DATE
// =========================

formatDateTime(
date: string
): string {


if (!date) {
  return '-';
}

return new Date(date)
  .toLocaleString('fr-FR');


}

// =========================
// FORMAT MONTANT
// =========================

formatMontant(
montant: number
): string {


return new Intl.NumberFormat(
  'fr-FR'
).format(montant || 0);


}

// =========================
// CLASSE STATUT
// =========================

getStatutClass(
statut: string
): string {


switch (statut) {

  case 'REUSSI':
    return 'reussi';

  case 'EN_COURS':
    return 'en-cours';

  case 'ECHEC':
    return 'echec';

  default:
    return '';

}


}

// =========================
// CLASSE MÉTHODE
// =========================

getMethodeClass(
methode: string
): string {


switch (
  methode?.toUpperCase()
) {

  case 'MOMO':
    return 'momo';

  case 'OM':
    return 'om';

  case 'CARTE':
    return 'carte';

  default:
    return '';

}


}

}
