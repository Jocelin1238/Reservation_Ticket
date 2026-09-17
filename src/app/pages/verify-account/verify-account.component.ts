import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-verify-account',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {

  // =====================================================
  // DONNÉES DU FORMULAIRE
  // =====================================================

  email: string = '';

  otp: string = '';


  // =====================================================
  // ÉTAT DE LA PAGE
  // =====================================================

  chargement: boolean = false;

  succes: string = '';

  erreur: string = '';


  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    console.log(
      '🔵 PAGE VERIFICATION COMPTE'
    );


    // -----------------------------------------------------
    // Récupérer l'email envoyé depuis Register
    // Exemple :
    // /verify-account?email=tati@gmail.com
    // -----------------------------------------------------

    this.route.queryParams.subscribe({

      next: (params: {
        [key: string]: string | undefined
      }) => {

        if (params['email']) {

          this.email =
            params['email'].trim();

          console.log(
            '📧 EMAIL RECU :',
            this.email
          );

        }

      },

      error: (error: unknown) => {

        console.error(
          '❌ ERREUR RECUPERATION PARAMETRES :',
          error
        );

      }

    });

  }


  // =====================================================
  // VERIFIER LE COMPTE
  // =====================================================

  verifierCompte(
    form: NgForm
  ): void {

    // -----------------------------------------------------
    // Réinitialisation des messages
    // -----------------------------------------------------

    this.erreur = '';

    this.succes = '';


    // -----------------------------------------------------
    // Vérification du formulaire
    // -----------------------------------------------------

    if (form.invalid) {

      this.erreur =
        'Veuillez renseigner votre email et le code de vérification.';

      return;

    }


    // -----------------------------------------------------
    // Vérification des valeurs
    // -----------------------------------------------------

    const emailFinal =
      this.email.trim();

    const otpFinal =
      this.otp.trim();


    if (!emailFinal) {

      this.erreur =
        'Veuillez saisir votre adresse email.';

      return;

    }


    if (!otpFinal) {

      this.erreur =
        'Veuillez saisir le code de vérification.';

      return;

    }


    // -----------------------------------------------------
    // Vérification du format OTP
    // -----------------------------------------------------

    if (!/^\d{6}$/.test(otpFinal)) {

      this.erreur =
        'Le code de vérification doit contenir 6 chiffres.';

      return;

    }


    // -----------------------------------------------------
    // Activation du chargement
    // -----------------------------------------------------

    this.chargement = true;


    console.log(
      '📤 VERIFICATION OTP ENVOYEE :',
      {
        email: emailFinal,
        otp: otpFinal
      }
    );


    // -----------------------------------------------------
    // Appel Backend
    // -----------------------------------------------------

    this.authService.verifyAccount({

      email: emailFinal,

      otp: otpFinal

    }).subscribe({

      // ===================================================
      // SUCCÈS
      // ===================================================

      next: (response: string) => {

        console.log(
          '✅ COMPTE VERIFIE :',
          response
        );


        this.chargement = false;


        this.succes =
          'Votre compte a été activé avec succès !';


        this.erreur = '';


        // -------------------------------------------------
        // Redirection vers Login
        // -------------------------------------------------

        setTimeout(() => {

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                email: emailFinal
              }
            }
          );

        }, 1500);

      },


      // ===================================================
      // ERREUR
      // ===================================================

      error: (error: any) => {

        console.error(
          '❌ ERREUR VERIFICATION OTP :',
          error
        );


        this.chargement = false;


        // -------------------------------------------------
        // Message personnalisé
        // -------------------------------------------------

        if (error.status === 400) {

          this.erreur =
            error.error?.message ||
            'Code OTP incorrect ou expiré.';

        }

        else if (error.status === 404) {

          this.erreur =
            'Utilisateur introuvable.';

        }

        else if (error.status === 0) {

          this.erreur =
            'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';

        }

        else {

          this.erreur =
            error.error?.message ||
            'Une erreur est survenue lors de la vérification du compte.';

        }


        this.succes = '';

      }

    });

  }


  // =====================================================
  // RENVoyer OTP
  // =====================================================

  renvoyerOtp(): void {

    // -----------------------------------------------------
    // Réinitialiser les messages
    // -----------------------------------------------------

    this.erreur = '';

    this.succes = '';


    // -----------------------------------------------------
    // Vérifier email
    // -----------------------------------------------------

    const emailFinal =
      this.email.trim();


    if (!emailFinal) {

      this.erreur =
        'Veuillez saisir votre adresse email.';

      return;

    }


    // -----------------------------------------------------
    // Éviter plusieurs clics
    // -----------------------------------------------------

    if (this.chargement) {

      return;

    }


    this.chargement = true;


    console.log(
      '📤 DEMANDE NOUVEL OTP :',
      emailFinal
    );


    // -----------------------------------------------------
    // Appel Backend
    // -----------------------------------------------------

    this.authService
      .resendOtp(emailFinal)
      .subscribe({

        // ===============================================
        // SUCCÈS
        // ===============================================

        next: (response: string) => {

          console.log(
            '✅ NOUVEL OTP ENVOYE :',
            response
          );


          this.chargement = false;


          this.succes =
            'Un nouveau code de vérification a été envoyé à votre adresse email.';

        },


        // ===============================================
        // ERREUR
        // ===============================================

        error: (error: any) => {

          console.error(
            '❌ ERREUR RENVOI OTP :',
            error
          );


          this.chargement = false;


          if (error.status === 400) {

            this.erreur =
              error.error?.message ||
              'Impossible de renvoyer le code.';

          }

          else if (error.status === 404) {

            this.erreur =
              'Aucun compte ne correspond à cette adresse email.';

          }

          else if (error.status === 0) {

            this.erreur =
              'Impossible de contacter le serveur.';

          }

          else {

            this.erreur =
              error.error?.message ||
              'Impossible de renvoyer le code de vérification.';

          }


          this.succes = '';

        }

      });

  }


  // =====================================================
  // RETOUR INSCRIPTION
  // =====================================================

  retournerInscription(): void {

    this.router.navigate([
      '/register'
    ]);

  }


  // =====================================================
  // ALLER LOGIN
  // =====================================================

  allerLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}