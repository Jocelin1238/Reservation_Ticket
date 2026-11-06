import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

interface Role {
  id: number;
  role: string;
  description: string;
}

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo: string | null;
  actif: boolean;
  compteVerrouille: boolean;
  compteExpire: boolean;
  credentialExpire: boolean;
  roles: Role[];
  dateCreation: string;
  dateModification: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {

  utilisateur: Utilisateur | null = null;
  chargement = false;
  erreur = '';
  uploadPhotoEnCours = false;

  // Édition des informations de profil
  modeEdition = false;
  sauvegardeEnCours = false;
  formDonnees = {
    telephone: '',
    adresse: ''
  };

  // Gestion du changement de mot de passe
  passwordForm!: FormGroup;
  afficherFormPassword = false;
  changementPasswordEnCours = false;
  succesPassword = '';
  erreurPassword = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.initialiserPasswordForm();
  }

  ngOnInit(): void {
    this.chargerProfil();
  }

  // =====================================================
  // INITIALISATION DU FORMULAIRE DE MOT DE PASSE
  // =====================================================
  private initialiserPasswordForm(): void {
    this.passwordForm = this.fb.group({
      ancienMotDePasse: ['', [Validators.required]],
      nouveauMotDePasse: ['', [Validators.required, Validators.minLength(8)]],
      confirmerMotDePasse: ['', [Validators.required]]
    }, { validators: this.motsDePasseIdentiquesValidator });
  }

  private motsDePasseIdentiquesValidator(control: AbstractControl): ValidationErrors | null {
    const nouveau = control.get('nouveauMotDePasse')?.value;
    const confirmation = control.get('confirmerMotDePasse')?.value;
    return nouveau === confirmation ? null : { motsDePasseDifferents: true };
  }

  toggleFormPassword(): void {
    this.afficherFormPassword = !this.afficherFormPassword;
    this.erreurPassword = '';
    this.succesPassword = '';
    this.passwordForm.reset();
  }

  changerMotDePasse(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changementPasswordEnCours = true;
    this.erreurPassword = '';
    this.succesPassword = '';

    const payload = {
      ancienMotDePasse: this.passwordForm.value.ancienMotDePasse,
      nouveauMotDePasse: this.passwordForm.value.nouveauMotDePasse
    };

    this.http.put('http://localhost:8080/api/utilisateurs/me/mot-de-passe', payload)
      .subscribe({
        next: () => {
          this.succesPassword = 'Mot de passe modifié avec succès !';
          this.changementPasswordEnCours = false;
          this.passwordForm.reset();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur changement mot de passe :', err);
          this.erreurPassword = err?.error?.message || 'L\'ancien mot de passe est incorrect ou invalide.';
          this.changementPasswordEnCours = false;
          this.cdr.detectChanges();
        }
      });
  }

  // =====================================================
  // CHARGER LE PROFIL
  // =====================================================
  chargerProfil(): void {
    this.chargement = true;
    this.erreur = '';

    this.http.get<Utilisateur>('http://localhost:8080/api/utilisateurs/me')
      .subscribe({
        next: (data) => {
          this.utilisateur = data;
          this.initialiserFormulaire();
          this.chargement = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur récupération profil :', error);
          this.erreur = 'Impossible de récupérer votre profil.';
          this.chargement = false;
        }
      });
  }

  private initialiserFormulaire(): void {
    if (this.utilisateur) {
      this.formDonnees = {
        telephone: this.utilisateur.telephone || '',
        adresse: this.utilisateur.adresse || ''
      };
    }
  }

  // =====================================================
  // MODES ÉDITION INFOS
  // =====================================================
  activerModeEdition(): void {
    this.initialiserFormulaire();
    this.modeEdition = true;
  }

  annulerEdition(): void {
    this.initialiserFormulaire();
    this.modeEdition = false;
  }

  sauvegarderProfil(): void {
    if (!this.utilisateur) return;

    this.sauvegardeEnCours = true;
    this.erreur = '';

    const payload = {
      telephone: this.formDonnees.telephone,
      adresse: this.formDonnees.adresse
    };

    this.http.put<Utilisateur>('http://localhost:8080/api/utilisateurs/me', payload)
      .subscribe({
        next: (utilisateurMisAJour) => {
          this.utilisateur = utilisateurMisAJour;
          this.sauvegardeEnCours = false;
          this.modeEdition = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur mise à jour profil :', error);
          this.erreur = error?.error?.message || 'Erreur lors de la mise à jour des informations.';
          this.sauvegardeEnCours = false;
          this.cdr.detectChanges();
        }
      });
  }

  // =====================================================
  // RETOUR TABLEAU DE BORD
  // =====================================================
  retourTableauDeBord(): void {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userJson);
      switch (user.role) {
        case 'ROLE_STAFF':
          this.router.navigate(['/dashboard-staff']);
          break;
        case 'ROLE_ADMIN':
          this.router.navigate(['/dashboard-admin']);
          break;
        case 'ROLE_SUPER_ADMIN':
          this.router.navigate(['/dashboard-superadmin']);
          break;
        case 'ROLE_USER':
          this.router.navigate(['/accueil']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    } catch (error) {
      this.router.navigate(['/login']);
    }
  }

  // =====================================================
  // SELECTION ET UPLOAD PHOTO
  // =====================================================
  selectionnerPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const fichier = input.files[0];
    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp'];

    if (!typesAutorises.includes(fichier.type)) {
      this.erreur = 'Format non autorisé. Utilisez JPG, PNG ou WEBP.';
      input.value = '';
      return;
    }

    if (fichier.size > 5 * 1024 * 1024) {
      this.erreur = 'La photo ne doit pas dépasser 5 Mo.';
      input.value = '';
      return;
    }

    this.uploadPhoto(fichier);
    input.value = '';
  }

  uploadPhoto(fichier: File): void {
    this.uploadPhotoEnCours = true;
    this.erreur = '';

    const formData = new FormData();
    formData.append('photo', fichier);

    this.http.post<Utilisateur>('http://localhost:8080/api/utilisateurs/me/photo', formData)
      .subscribe({
        next: (utilisateurMisAJour) => {
          this.utilisateur = utilisateurMisAJour;
          this.uploadPhotoEnCours = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.erreur = error?.error?.message || 'Impossible de modifier votre photo.';
          this.uploadPhotoEnCours = false;
          this.cdr.detectChanges();
        }
      });
  }

  getPhotoUrl(photo: string | null): string {
    if (!photo) return '';
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
    return `http://localhost:8080${photo}`;
  }

  get nomComplet(): string {
    return this.utilisateur ? `${this.utilisateur.prenom} ${this.utilisateur.nom}` : '';
  }

  get rolePrincipal(): string {
    if (!this.utilisateur || !this.utilisateur.roles || this.utilisateur.roles.length === 0) {
      return 'Utilisateur';
    }
    return this.utilisateur.roles[0].role.replace('ROLE_', '').replace(/_/g, ' ');
  }

  get initiales(): string {
    if (!this.utilisateur) return '';
    const prenom = this.utilisateur.prenom?.charAt(0) || '';
    const nom = this.utilisateur.nom?.charAt(0) || '';
    return `${prenom}${nom}`.toUpperCase();
  }

  formaterDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}