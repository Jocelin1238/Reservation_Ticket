import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  Router
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email = '';

  chargement = false;
  succes = '';
  erreur = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =====================================================
  // ENVOYER OTP
  // =====================================================

  envoyerOtp(form: NgForm): void {

    this.erreur = '';
    this.succes = '';

    if (form.invalid) {

      this.erreur =
        'Veuillez saisir une adresse email valide.';

      return;
    }

    this.chargement = true;

    const email = this.email.trim();

    console.log(
      '📤 DEMANDE OTP MOT DE PASSE :',
      email
    );

    this.authService.forgotPassword({
      email: email
    }).subscribe({

      next: (response: any) => {

        console.log(
          '✅ OTP MOT DE PASSE ENVOYE :',
          response
        );

        this.chargement = false;

        this.succes =
          'Un code de vérification a été envoyé à votre adresse email.';

        setTimeout(() => {

          this.router.navigate(
            ['/reset-password'],
            {
              queryParams: {
                email: email
              }
            }
          );

        }, 1500);

      },

      error: (error: any) => {

        console.error(
          '❌ ERREUR MOT DE PASSE OUBLIE :',
          error
        );

        this.chargement = false;

        if (error.status === 404) {

          this.erreur =
            'Aucun compte ne correspond à cette adresse email.';

        } else if (error.status === 400) {

          this.erreur =
            error.error?.message ||
            'Adresse email invalide.';

        } else {

          this.erreur =
            error.error?.message ||
            'Une erreur est survenue. Veuillez réessayer.';
        }

      }

    });

  }


  // =====================================================
  // RETOUR LOGIN
  // =====================================================

  allerLogin(): void {

    this.router.navigate(
      ['/login']
    );

  }


  // =====================================================
  // RETOUR REGISTER
  // =====================================================

  allerRegister(): void {

    this.router.navigate(
      ['/register']
    );

  }

}