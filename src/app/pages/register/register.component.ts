import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // =====================================================
  // FORMULAIRE
  // =====================================================

  registerForm: FormGroup;

  // =====================================================
  // ÉTATS
  // =====================================================

  chargement = false;

  erreur = '';

  succes = '';

  afficherMotDePasse = false;

  afficherConfirmation = false;

  accepterConditions = false;

  // =====================================================
  // CONSTRUCTEUR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      prenom: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      telephone: [
        '',
        [
          Validators.pattern(/^[0-9+\s()-]{8,20}$/)
        ]
      ],

      adresse: [
        ''
      ],

      motDePasse: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmationMotDePasse: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }


  // =====================================================
  // GETTERS
  // =====================================================

  get prenom() {
    return this.registerForm.get('prenom');
  }

  get nom() {
    return this.registerForm.get('nom');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get telephone() {
    return this.registerForm.get('telephone');
  }

  get motDePasse() {
    return this.registerForm.get('motDePasse');
  }

  get confirmationMotDePasse() {
    return this.registerForm.get(
      'confirmationMotDePasse'
    );
  }


  // =====================================================
  // AFFICHER / MASQUER MOT DE PASSE
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
  // VÉRIFICATION MOT DE PASSE
  // =====================================================

  motsDePasseIdentiques(): boolean {

    return (
      this.motDePasse?.value ===
      this.confirmationMotDePasse?.value
    );

  }


  // =====================================================
  // SUBMIT
  // =====================================================

  inscrire(): void {

    this.erreur = '';

    this.succes = '';


    // Vérifier formulaire

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      this.erreur =
        'Veuillez corriger les champs obligatoires.';

      return;

    }


    // Vérifier conditions

    if (!this.accepterConditions) {

      this.erreur =
        'Vous devez accepter les conditions d’utilisation.';

      return;

    }


    // Vérifier mot de passe

    if (!this.motsDePasseIdentiques()) {

      this.erreur =
        'Les mots de passe ne correspondent pas.';

      return;

    }


    this.chargement = true;


    // ===================================================
    // DONNÉES ENVOYÉES AU BACKEND
    // ===================================================

    const data = {

      nom:
        this.registerForm.value.nom.trim(),

      prenom:
        this.registerForm.value.prenom.trim(),

      email:
        this.registerForm.value.email
          .trim()
          .toLowerCase(),

      motDePasse:
        this.registerForm.value.motDePasse,

      telephone:
        this.registerForm.value.telephone?.trim() || '',

      adresse:
        this.registerForm.value.adresse?.trim() || ''

    };


    console.log(
      '📤 INSCRIPTION ENVOYÉE :',
      data
    );


    // ===================================================
    // APPEL BACKEND
    // ===================================================

    this.authService
      .register(data)
      .subscribe({

        // ===============================================
        // SUCCÈS
        // ===============================================

        next: (response) => {

          console.log(
            '✅ INSCRIPTION RÉUSSIE :',
            response
          );

          this.chargement = false;

          this.succes =
            'Compte créé avec succès ! Un code OTP vous a été envoyé.';


          // Récupérer l'email

          const email =
            response?.email ||
            data.email;


          // =============================================
          // REDIRECTION OTP
          // =============================================

          setTimeout(() => {

            this.router.navigate(
              ['/verify-account'],
              {
                queryParams: {
                  email: email
                }
              }
            );

          }, 1200);

        },


        // ===============================================
        // ERREUR
        // ===============================================

        error: (error) => {

          console.error(
            '❌ ERREUR INSCRIPTION :',
            error
          );

          this.chargement = false;


          // ---------------------------------------------
          // Email déjà utilisé
          // ---------------------------------------------

          if (
            error.status === 409
          ) {

            this.erreur =
              'Cette adresse email est déjà utilisée.';

            return;

          }


          // ---------------------------------------------
          // Erreur validation
          // ---------------------------------------------

          if (
            error.status === 400
          ) {

            this.erreur =
              error.error?.message ||
              'Les informations fournies sont invalides.';

            return;

          }


          // ---------------------------------------------
          // Erreur serveur
          // ---------------------------------------------

          if (
            error.status === 500
          ) {

            this.erreur =
              error.error?.message ||
              'Une erreur est survenue sur le serveur.';

            return;

          }


          // ---------------------------------------------
          // Erreur générale
          // ---------------------------------------------

          this.erreur =
            error.error?.message ||
            error.error ||
            'Impossible de créer le compte. Veuillez réessayer.';

        }

      });

  }


  // =====================================================
  // NAVIGATION LOGIN
  // =====================================================

  allerLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }


  // =====================================================
  // CONDITIONS
  // =====================================================

  toggleConditions(): void {

    this.accepterConditions =
      !this.accepterConditions;

  }

}