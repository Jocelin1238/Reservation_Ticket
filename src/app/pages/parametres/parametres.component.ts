import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  photo?: string | null;
  role?: string;
}

@Component({
  selector: 'app-parametres',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './parametres.component.html',
  styleUrl: './parametres.component.css'
})
export class ParametresComponent implements OnInit {

  // =====================================================
  // UTILISATEUR CONNECTÉ
  // =====================================================

  utilisateur: Utilisateur | null = null;

  chargement = true;

  // =====================================================
  // INFORMATIONS COMPTE
  // =====================================================

  nom = '';
  prenom = '';
  email = '';
  telephone = '';

  // =====================================================
  // PREFERENCES
  // =====================================================

  notificationsEmail = true;
  notificationsSysteme = true;
  notificationsReservation = true;
  notificationsPaiement = true;

  // =====================================================
  // SECURITE
  // =====================================================

  ancienMotDePasse = '';
  nouveauMotDePasse = '';
  confirmerMotDePasse = '';

  afficherAncienMotDePasse = false;
  afficherNouveauMotDePasse = false;
  afficherConfirmation = false;

  // =====================================================
  // API
  // =====================================================

  private readonly API_URL =
    'http://localhost:8080/api';

  // =====================================================
  // ROLE DE L'UTILISATEUR
  // =====================================================

  roleUtilisateur = '';

  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.recupererRole();

    this.chargerUtilisateur();

  }

  // =====================================================
  // RECUPERER LE ROLE
  // =====================================================

  recupererRole(): void {

    // -----------------------------------------------------
    // 1. Récupérer l'utilisateur enregistré
    // -----------------------------------------------------

    const userString =
      localStorage.getItem('user');

    if (userString) {

      try {

        const user = JSON.parse(userString);

        console.log(
          '👤 Utilisateur localStorage :',
          user
        );

        this.roleUtilisateur =
          user.role ||
          user.roles?.[0] ||
          '';

      } catch (error) {

        console.error(
          '❌ Erreur lecture utilisateur localStorage :',
          error
        );

      }

    }

    // -----------------------------------------------------
    // 2. Si aucun rôle trouvé, essayer les clés possibles
    // -----------------------------------------------------

    if (!this.roleUtilisateur) {

      const role =
        localStorage.getItem('role');

      if (role) {

        this.roleUtilisateur = role;

      }

    }

    console.log(
      '🔐 Rôle détecté :',
      this.roleUtilisateur
    );

  }

  // =====================================================
  // CHARGER UTILISATEUR CONNECTÉ
  // =====================================================

  chargerUtilisateur(): void {

    this.chargement = true;

    this.http
      .get<Utilisateur>(
        `${this.API_URL}/utilisateurs/me`
      )
      .subscribe({

        next: (data) => {

          console.log(
            '👤 Utilisateur connecté :',
            data
          );

          this.utilisateur = data;

          this.nom =
            data.nom || '';

          this.prenom =
            data.prenom || '';

          this.email =
            data.email || '';

          this.telephone =
            data.telephone || '';

          // ------------------------------------------------
          // Si le backend renvoie le rôle,
          // on le prend en priorité
          // ------------------------------------------------

          if (data.role) {

            this.roleUtilisateur =
              data.role;

          }

          this.chargement = false;

        },

        error: (error) => {

          console.error(
            '❌ Erreur récupération utilisateur :',
            error
          );

          this.chargement = false;

        }

      });

  }

  // =====================================================
  // ROLE
  // =====================================================

  get role(): string {

    return this.roleUtilisateur;

  }

  // =====================================================
  // ROLE AFFICHÉ
  // =====================================================

  get roleAffiche(): string {

    switch (this.roleUtilisateur) {

      case 'ROLE_STAFF':
        return 'Staff';

      case 'ROLE_ADMIN':
        return 'Administrateur';

      case 'ROLE_SUPER_ADMIN':
        return 'Super Administrateur';

      case 'ROLE_USER':
        return 'Utilisateur';

      default:
        return 'Utilisateur';

    }

  }

  // =====================================================
  // RETOUR TABLEAU DE BORD
  // =====================================================

  retourTableauDeBord(): void {

    console.log(
      '🔐 Rôle avant redirection :',
      this.roleUtilisateur
    );

    switch (this.roleUtilisateur) {

      case 'ROLE_STAFF':

        console.log(
          '➡️ Redirection Staff'
        );

        this.router.navigate([
          '/dashboard-staff'
        ]);

        break;


      case 'ROLE_ADMIN':

        console.log(
          '➡️ Redirection Admin'
        );

        this.router.navigate([
          '/dashboard-admin'
        ]);

        break;


      case 'ROLE_SUPER_ADMIN':

        console.log(
          '➡️ Redirection Super Admin'
        );

        this.router.navigate([
          '/dashboard-superadmin'
        ]);

        break;


      case 'ROLE_USER':

        console.log(
          '➡️ Redirection User'
        );

        this.router.navigate([
          '/accueil'
        ]);

        break;


      default:

        console.warn(
          '⚠️ Rôle inconnu :',
          this.roleUtilisateur
        );

        // On évite de forcer dashboard-user
        // si le rôle n'a pas été détecté.

        this.router.navigate([
          '/accueil'
        ]);

        break;

    }

  }

  // =====================================================
  // SAUVEGARDER PARAMETRES
  // =====================================================

  sauvegarderParametres(): void {

    console.log(
      '⚙️ Paramètres sauvegardés'
    );

    console.log({

      nom: this.nom,

      prenom: this.prenom,

      email: this.email,

      telephone: this.telephone,

      notificationsEmail:
        this.notificationsEmail,

      notificationsSysteme:
        this.notificationsSysteme,

      notificationsReservation:
        this.notificationsReservation,

      notificationsPaiement:
        this.notificationsPaiement

    });

  }

  // =====================================================
  // CHANGER MOT DE PASSE
  // =====================================================

  changerMotDePasse(): void {

    if (
      !this.ancienMotDePasse ||
      !this.nouveauMotDePasse ||
      !this.confirmerMotDePasse
    ) {

      alert(
        'Veuillez remplir tous les champs.'
      );

      return;

    }

    if (
      this.nouveauMotDePasse !==
      this.confirmerMotDePasse
    ) {

      alert(
        'Les nouveaux mots de passe ne correspondent pas.'
      );

      return;

    }

    console.log(
      '🔐 Demande de changement de mot de passe'
    );

  }

}