import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth';

import { UtilisateurService } from '../../Utilisateur.service';

import { Utilisateur } from '../../models/utilisateur';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { UserDetailsDialogComponent } from '../../components/user-details-dialog/user-details-dialog.component';


@Component({

  selector: 'app-utilisateurs',

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,

    SidebarComponent,
    SidebarAdminComponent,
    TopbarComponent,

    AddUserDialogComponent,
    EditUserDialogComponent,
    UserDetailsDialogComponent

  ],

  templateUrl: './utilisateurs.component.html',

  styleUrl: './utilisateurs.component.css'

})


export class UtilisateursComponent implements OnInit {


  // =========================================================
  // COLONNES
  // =========================================================

  displayedColumns: string[] = [

    'nom',
    'email',
    'role',
    'actions'

  ];


  // =========================================================
  // UTILISATEURS
  // =========================================================

  users: Utilisateur[] = [];

  dataSource =
    new MatTableDataSource<Utilisateur>([]);


  searchText = '';


  // =========================================================
  // ROLE DE L'UTILISATEUR CONNECTÉ
  // =========================================================

  roleUtilisateur = '';


  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(

    private dialog: MatDialog,

    private utilisateurService: UtilisateurService,

    private authService: AuthService

  ) {}


  // =========================================================
  // INITIALISATION
  // =========================================================

  ngOnInit(): void {

    this.roleUtilisateur =
      this.authService.getUserRole();

    console.log(
      '🎯 Rôle connecté :',
      this.roleUtilisateur
    );

    this.loadUsers();

  }


  // =========================================================
  // RÉCUPÉRER LE RÔLE D'UN UTILISATEUR
  // =========================================================

  getRoleUtilisateur(
    user: Utilisateur
  ): string {

    if (
      !user.roles ||
      user.roles.length === 0
    ) {

      return '';

    }

    return user.roles[0].role;

  }


  // =========================================================
  // VÉRIFIER SI SUPER ADMIN
  // =========================================================

  isSuperAdmin(
    user: Utilisateur
  ): boolean {

    return this.getRoleUtilisateur(user)
      === 'ROLE_SUPER_ADMIN';

  }


  // =========================================================
  // VÉRIFIER SI ADMIN
  // =========================================================

  isAdmin(
    user: Utilisateur
  ): boolean {

    return this.getRoleUtilisateur(user)
      === 'ROLE_ADMIN';

  }


  // =========================================================
  // VÉRIFIER SI STAFF
  // =========================================================

  isStaff(
    user: Utilisateur
  ): boolean {

    return this.getRoleUtilisateur(user)
      === 'ROLE_STAFF';

  }


  // =========================================================
  // VÉRIFIER SI USER
  // =========================================================

  isUser(
    user: Utilisateur
  ): boolean {

    return this.getRoleUtilisateur(user)
      === 'ROLE_USER';

  }


  // =========================================================
  // DROITS SUPER ADMIN
  // =========================================================

  isSuperAdminConnecte(): boolean {

    return this.roleUtilisateur
      === 'ROLE_SUPER_ADMIN';

  }


  // =========================================================
  // DROITS ADMIN
  // =========================================================

  isAdminConnecte(): boolean {

    return this.roleUtilisateur
      === 'ROLE_ADMIN';

  }


  // =========================================================
  // L'ADMIN NE PEUT PAS GÉRER LES ADMINISTRATEURS
  // =========================================================

  peutModifier(
    user: Utilisateur
  ): boolean {

    const role =
      this.getRoleUtilisateur(user);


    // SUPER ADMIN
    if (
      this.roleUtilisateur
      === 'ROLE_SUPER_ADMIN'
    ) {

      // Le SUPER ADMIN ne modifie pas
      // un autre SUPER ADMIN

      return role !== 'ROLE_SUPER_ADMIN';

    }


    // ADMIN
    if (
      this.roleUtilisateur
      === 'ROLE_ADMIN'
    ) {

      // L'ADMIN peut modifier uniquement
      // USER et STAFF

      return (
        role === 'ROLE_USER' ||
        role === 'ROLE_STAFF'
      );

    }


    return false;

  }


  // =========================================================
  // DROIT DE SUPPRESSION
  // =========================================================

  peutSupprimer(
    user: Utilisateur
  ): boolean {

    const role =
      this.getRoleUtilisateur(user);


    // SUPER ADMIN
    if (
      this.roleUtilisateur
      === 'ROLE_SUPER_ADMIN'
    ) {

      // Il ne supprime pas un autre
      // SUPER ADMIN

      return role !== 'ROLE_SUPER_ADMIN';

    }


    // ADMIN
    if (
      this.roleUtilisateur
      === 'ROLE_ADMIN'
    ) {

      // ADMIN peut supprimer USER
      // mais pas STAFF / ADMIN / SUPER ADMIN

      return role === 'ROLE_USER';

    }


    return false;

  }


  // =========================================================
  // DROIT D'AJOUT
  // =========================================================

  peutAjouterUtilisateur(): boolean {

    return (

      this.roleUtilisateur
      === 'ROLE_SUPER_ADMIN'

      ||

      this.roleUtilisateur
      === 'ROLE_ADMIN'

    );

  }


  // =========================================================
  // RECHERCHE
  // =========================================================

  filterUsers(): void {

    const keyword =
      this.searchText
        .trim()
        .toLowerCase();


    if (!keyword) {

      this.dataSource.data =
        this.users;

      return;

    }


    this.dataSource.data =
      this.users.filter(
        user =>

          user.nom
            ?.toLowerCase()
            .includes(keyword)

          ||

          user.prenom
            ?.toLowerCase()
            .includes(keyword)

          ||

          user.email
            ?.toLowerCase()
            .includes(keyword)

      );

  }


  // =========================================================
  // AJOUTER UTILISATEUR
  // =========================================================

  openDialog(): void {


    if (
      !this.peutAjouterUtilisateur()
    ) {

      console.warn(
        '❌ Vous n’avez pas le droit de créer un utilisateur.'
      );

      return;

    }


    const dialogRef =
      this.dialog.open(
        AddUserDialogComponent,
        {

          width: '600px',

          disableClose: true

        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {


        if (!result) {

          return;

        }


        // =================================================
        // ADMIN
        // =================================================

        if (
          this.roleUtilisateur
          === 'ROLE_ADMIN'
        ) {

          /*
           * Un ADMIN ne peut créer que
           * USER ou STAFF.
           *
           * Même si le formulaire envoie
           * ADMIN ou SUPER_ADMIN, on bloque.
           */

          const roleDemande =
            result.roles?.[0]?.role
            || result.role;


          if (
            roleDemande === 'ROLE_ADMIN'
            ||
            roleDemande === 'ROLE_SUPER_ADMIN'
          ) {

            console.warn(
              '❌ Un ADMIN ne peut pas créer un administrateur.'
            );

            return;

          }

        }


        this.utilisateurService
          .createUser(result)
          .subscribe({

            next: response => {

              console.log(
                '✅ Utilisateur créé :',
                response
              );

              this.loadUsers();

            },

            error: error => {

              console.error(
                '❌ Erreur création utilisateur :',
                error
              );

            }

          });

      });

  }


  // =========================================================
  // VOIR UTILISATEUR
  // =========================================================

  viewUser(
    user: Utilisateur
  ): void {

    this.dialog.open(
      UserDetailsDialogComponent,
      {

        width: '500px',

        data: user

      }
    );

  }


  // =========================================================
  // CHARGER UTILISATEURS
  // =========================================================

  loadUsers(): void {


    this.utilisateurService
      .getUsers()
      .subscribe({

        next: (data: Utilisateur[]) => {

          console.log(
            '📋 Liste utilisateurs :',
            data
          );


          this.users = data;

          this.dataSource.data =
            data;

        },

        error: error => {

          console.error(
            '❌ Erreur chargement utilisateurs :',
            error
          );

        }

      });

  }


  // =========================================================
  // MODIFIER UTILISATEUR
  // =========================================================

  openEditDialog(
    user: Utilisateur
  ): void {


    if (
      !this.peutModifier(user)
    ) {

      console.warn(
        '❌ Modification interdite pour cet utilisateur.'
      );

      return;

    }


    const role =
      this.getRoleUtilisateur(user);


    /*
     * ADMIN
     *
     * Sécurité supplémentaire :
     * il ne peut jamais modifier
     * ADMIN ou SUPER_ADMIN.
     */

    if (
      this.roleUtilisateur
      === 'ROLE_ADMIN'
      &&
      (
        role === 'ROLE_ADMIN'
        ||
        role === 'ROLE_SUPER_ADMIN'
      )
    ) {

      console.warn(
        '❌ Un ADMIN ne peut pas modifier un administrateur.'
      );

      return;

    }


    const dialogRef =
      this.dialog.open(
        EditUserDialogComponent,
        {

          width: '600px',

          data: user

        }
      );


    dialogRef
      .afterClosed()
      .subscribe(result => {


        if (!result) {

          return;

        }


        // =================================================
        // PROTECTION DU RÔLE
        // =================================================

        if (
          this.roleUtilisateur
          === 'ROLE_ADMIN'
        ) {

          const nouveauRole =
            result.roles?.[0]?.role
            || result.role;


          /*
           * L'ADMIN ne peut pas attribuer
           * le rôle ADMIN ou SUPER_ADMIN.
           */

          if (
            nouveauRole === 'ROLE_ADMIN'
            ||
            nouveauRole === 'ROLE_SUPER_ADMIN'
          ) {

            console.warn(
              '❌ Un ADMIN ne peut pas attribuer ce rôle.'
            );

            return;

          }

        }


        this.utilisateurService
          .updateUser(
            user.id!,
            result
          )
          .subscribe({

            next: response => {

              console.log(
                '✅ Utilisateur modifié :',
                response
              );

              this.loadUsers();

            },

            error: error => {

              console.error(
                '❌ Erreur modification utilisateur :',
                error
              );

            }

          });

      });

  }


  // =========================================================
  // SUPPRIMER UTILISATEUR
  // =========================================================

  deleteUser(
    id?: number
  ): void {


    if (!id) {

      console.error(
        '❌ ID utilisateur invalide.'
      );

      return;

    }


    const user =
      this.users.find(
        u => u.id === id
      );


    if (!user) {

      console.error(
        '❌ Utilisateur introuvable.'
      );

      return;

    }


    // =================================================
    // VÉRIFICATION DES DROITS
    // =================================================

    if (
      !this.peutSupprimer(user)
    ) {

      console.warn(
        '❌ Suppression interdite pour cet utilisateur.'
      );

      return;

    }


    const role =
      this.getRoleUtilisateur(user);


    // =================================================
    // CONFIRMATION
    // =================================================

    const confirmation =
      confirm(

        `Voulez-vous vraiment supprimer ${user.prenom} ${user.nom} ?`

      );


    if (!confirmation) {

      return;

    }


    // =================================================
    // SUPPRESSION
    // =================================================

    this.utilisateurService
      .deleteUser(id)
      .subscribe({

        next: () => {

          console.log(
            '✅ Utilisateur supprimé avec succès.'
          );

          this.loadUsers();

        },

        error: error => {

          console.error(
            '❌ Erreur suppression utilisateur :',
            error
          );

        }

      });

  }

}