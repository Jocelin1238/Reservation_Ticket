import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // =====================================================
  // CHAMPS DU FORMULAIRE
  // =====================================================

  email: string = '';

  password: string = '';

  loading: boolean = false;


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================================
  // CONNEXION
  // =====================================================

  login(): void {

    // -----------------------------------------------------
    // Vérification des champs
    // -----------------------------------------------------

    if (!this.email.trim() || !this.password.trim()) {

      alert('Veuillez remplir tous les champs.');

      return;
    }


    // -----------------------------------------------------
    // Activation du chargement
    // -----------------------------------------------------

    this.loading = true;


    // -----------------------------------------------------
    // Données envoyées au backend
    // -----------------------------------------------------

    const loginRequest = {

      email: this.email.trim(),

      motDePasse: this.password

    };


    console.log(
      '🔵 Connexion en cours...',
      loginRequest.email
    );


    // -----------------------------------------------------
    // Appel API
    // -----------------------------------------------------

    this.authService
      .login(loginRequest)
      .subscribe({

        // ===============================================
        // SUCCÈS
        // ===============================================

        next: (response: any) => {

          console.log(
            '✅ Réponse Backend :',
            response
          );


          this.loading = false;


          // ---------------------------------------------
          // Vérification du token
          // ---------------------------------------------

          if (!response || !response.token) {

            console.error(
              '❌ Aucun token reçu du backend.'
            );

            alert(
              'Connexion impossible : token non reçu.'
            );

            return;
          }


          // ---------------------------------------------
          // Sauvegarde du token
          // ---------------------------------------------

          this.authService.saveToken(
            response.token
          );


          // ---------------------------------------------
          // Récupération du rôle
          // ---------------------------------------------

          let role =
            response.role ||
            response.roles ||
            null;


          // ---------------------------------------------
          // Si roles est un tableau
          // ---------------------------------------------

          if (Array.isArray(role)) {

            role = role[0];

          }


          // ---------------------------------------------
          // Normalisation du rôle
          // ---------------------------------------------

          if (role) {

            role = String(role)
              .trim()
              .toUpperCase();

          }


          console.log(
            '👤 Rôle reçu :',
            role
          );


          // ---------------------------------------------
          // Sauvegarde utilisateur
          // ---------------------------------------------

          const utilisateur = {

            id: response.id,

            email: response.email,

            nom: response.nom,

            prenom: response.prenom,

            role: role

          };


          localStorage.setItem(
            'utilisateur',
            JSON.stringify(utilisateur)
          );


          // ---------------------------------------------
          // Compatibilité avec ton ancien code
          // ---------------------------------------------

          localStorage.setItem(
            'user',
            JSON.stringify(utilisateur)
          );


          console.log(
            '💾 Utilisateur sauvegardé :',
            utilisateur
          );


          // ---------------------------------------------
          // Message
          // ---------------------------------------------

          alert(
            'Connexion réussie.'
          );


          // ---------------------------------------------
          // REDIRECTION SELON LE RÔLE
          // ---------------------------------------------

          this.redirigerSelonRole(role);

        },


        // ===============================================
        // ERREUR
        // ===============================================

        error: (error) => {

          console.error(
            '❌ Erreur connexion :',
            error
          );


          this.loading = false;


          if (error.status === 401) {

            alert(
              'Email ou mot de passe incorrect.'
            );

          }

          else if (error.status === 403) {

            alert(
              'Votre compte n\'est pas autorisé à accéder à cette application.'
            );

          }

          else if (error.status === 0) {

            alert(
              'Impossible de contacter le serveur.'
            );

          }

          else {

            alert(
              'Une erreur est survenue lors de la connexion.'
            );

          }

        }

      });

  }


  // =====================================================
  // REDIRECTION SELON LE ROLE
  // =====================================================

  private redirigerSelonRole(role: string | null): void {

    console.log(
      '🔀 Redirection selon le rôle :',
      role
    );


    switch (role) {


      // =================================================
      // SUPER ADMIN
      // =================================================

      case 'ROLE_SUPER_ADMIN':

        console.log(
          '👑 Connexion SuperAdmin'
        );

        this.router.navigate([
          '/dashboard-superadmin'
        ]);

        break;


      // =================================================
      // ADMIN
      // =================================================

      case 'ROLE_ADMIN':

        console.log(
          '🛡️ Connexion Admin'
        );

        this.router.navigate([
          '/dashboard-admin'
        ]);

        break;


      // =================================================
      // STAFF
      // =================================================

      case 'ROLE_STAFF':

        console.log(
          '👨‍💼 Connexion Staff'
        );

        this.router.navigate([
          '/dashboard-staff'
        ]);

        break;


      // =================================================
      // UTILISATEUR
      // =================================================

      case 'ROLE_USER':

        console.log(
          '👤 Connexion utilisateur'
        );

        this.router.navigate([
          '/accueil'
        ]);

        break;


      // =================================================
      // ROLE INCONNU
      // =================================================

      default:

        console.warn(
          '⚠️ Rôle inconnu :',
          role
        );

        alert(
          'Votre rôle utilisateur est inconnu.'
        );

        this.router.navigate([
          '/login'
        ]);

        break;

    }

  }
allerMotDePasseOublie(): void {

  this.router.navigate(
    ['/forgot-password']
  );

}
}