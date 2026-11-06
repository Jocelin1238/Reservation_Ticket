import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  email = '';
  otp = '';

  nouveauMotDePasse = '';
  confirmationMotDePasse = '';

  afficherMotDePasse = false;
  afficherConfirmation = false;

  chargement = false;
  succes = '';
  erreur = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    this.route.queryParams.subscribe(
      (params: any) => {

        if (params['email']) {

          this.email =
            params['email'];

        }

      }
    );

  }


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  reinitialiserMotDePasse(
    form: NgForm
  ): void {

    this.erreur = '';
    this.succes = '';

    if (form.invalid) {

      this.erreur =
        'Veuillez remplir correctement tous les champs.';

      return;
    }


    if (
      this.nouveauMotDePasse !==
      this.confirmationMotDePasse
    ) {

      this.erreur =
        'Les mots de passe ne correspondent pas.';

      return;
    }


    if (
      this.nouveauMotDePasse.length < 6
    ) {

      this.erreur =
        'Le mot de passe doit contenir au moins 6 caractères.';

      return;
    }


    this.chargement = true;


    const data = {

      email:
        this.email.trim(),

      otp:
        this.otp.trim(),

      nouveauMotDePasse:
        this.nouveauMotDePasse,

      confirmationMotDePasse:
        this.confirmationMotDePasse

    };


    console.log(
      '📤 RESET PASSWORD ENVOYE :',
      data
    );


    this.authService
      .resetPassword(data)
      .subscribe({

        next: (response: any) => {

          console.log(
            '✅ MOT DE PASSE MODIFIE :',
            response
          );

          this.chargement = false;

          this.succes =
            'Votre mot de passe a été modifié avec succès !';


          setTimeout(() => {

            this.router.navigate(
              ['/login'],
              {
                queryParams: {
                  email: this.email
                }
              }
            );

          }, 1800);

        },


        error: (error: any) => {

          console.error(
            '❌ ERREUR RESET PASSWORD :',
            error
          );

          this.chargement = false;


          if (
            error.status === 400
          ) {

            this.erreur =
              error.error?.message ||
              'Code OTP incorrect ou expiré.';

          } else if (
            error.status === 404
          ) {

            this.erreur =
              'Utilisateur introuvable.';

          } else {

            this.erreur =
              error.error?.message ||
              'Impossible de modifier le mot de passe.';
          }

        }

      });

  }


  // =====================================================
  // RENVOYER OTP
  // =====================================================

  renvoyerOtp(): void {

    this.erreur = '';
    this.succes = '';

    if (!this.email.trim()) {

      this.erreur =
        'Adresse email introuvable.';

      return;
    }


    this.chargement = true;


    this.authService
      .forgotPassword({
        email: this.email.trim()
      })
      .subscribe({

        next: (response: any) => {

          console.log(
            '✅ NOUVEL OTP ENVOYE :',
            response
          );

          this.chargement = false;

          this.succes =
            'Un nouveau code OTP a été envoyé à votre adresse email.';

        },


        error: (error: any) => {

          console.error(
            '❌ ERREUR RENVOI OTP :',
            error
          );

          this.chargement = false;

          this.erreur =
            error.error?.message ||
            'Impossible de renvoyer le code OTP.';

        }

      });

  }


  // =====================================================
  // AFFICHER MOT DE PASSE
  // =====================================================

  toggleMotDePasse(): void {

    this.afficherMotDePasse =
      !this.afficherMotDePasse;

  }


  toggleConfirmation(): void {

    this.afficherConfirmation =
      !this.afficherConfirmation;

  }


  // =====================================================
  // RETOUR
  // =====================================================

  retournerLogin(): void {

    this.router.navigate(
      ['/login']
    );

  }


  retournerForgotPassword(): void {

    this.router.navigate(
      ['/forgot-password']
    );

  }

}