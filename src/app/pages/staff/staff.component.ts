import {
  Component,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';
import { UserDetailsDialogComponent } from '../../components/user-details-dialog/user-details-dialog.component';

import { UtilisateurService } from '../../Utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    EditUserDialogComponent,
    UserDetailsDialogComponent,
     SidebarComponent,
  TopbarComponent
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {

  displayedColumns: string[] = [
    'nom',
    'email',
    'role',
    'actions'
  ];

  users: Utilisateur[] = [];

  dataSource = new MatTableDataSource<Utilisateur>([]);

  searchText: string = '';

  constructor(
    private dialog: MatDialog,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  filterUsers(): void {

    const keyword = this.searchText.trim().toLowerCase();

    if (keyword === '') {

      this.dataSource.data = this.users;

      return;

    }

    this.dataSource.data = this.users.filter(user =>

      user.nom.toLowerCase().includes(keyword)

      ||

      user.email.toLowerCase().includes(keyword)

    );

  }

  // ============================
  // Ajouter staff
  // ============================

  openDialog(): void {

    const dialogRef = this.dialog.open(
      AddUserDialogComponent,
      {
        width: '600px',
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        const staff = {
          ...result,
          role: 'ROLE_STAFF'
        };

        this.utilisateurService.createUser(staff as Utilisateur)
          .subscribe({

            next: () => {

              console.log("Staff créé");

              this.loadStaff();

            },

            error: (error) => {

              console.error(error);

            }

          });

      }

    });

  }

  // ============================
  // Voir détails
  // ============================

  viewUser(user: Utilisateur): void {

    this.dialog.open(
      UserDetailsDialogComponent,
      {
        width: '500px',
        data: user
      }
    );

  }

  // ============================
  // Charger staff
  // ============================

  loadStaff(): void {

    this.utilisateurService.getStaff()

      .subscribe({

        next: (data: Utilisateur[]) => {

          console.log("Liste staff :", data);

          this.users = data;

          this.dataSource.data = data;

        },

        error: (error) => {

          console.error(error);

        }

      });

  }
    // ============================
  // Modifier staff
  // ============================

  openEditDialog(user: Utilisateur): void {

    const dialogRef = this.dialog.open(

      EditUserDialogComponent,

      {

        width: '600px',

        data: user

      }

    );

    dialogRef.afterClosed()

      .subscribe(result => {

        if (result) {

          const admin = {

            ...result,

            role: 'ROLE_STAFF'

          };

          this.utilisateurService

            .updateUser(

              user.id!,

              admin as Utilisateur

            )

            .subscribe({

              next: (response) => {

                console.log(

                  "Staff modifié :",

                  response

                );

                this.loadStaff();

              },

              error: (error) => {

                console.error(

                  "Erreur modification staff :",

                  error

                );

              }

            });

        }

      });

  }

  // ============================
  // Supprimer staff
  // ============================

  deleteUser(id?: number): void {

    if (!id) {

      console.error(

        "ID staff invalide"

      );

      return;

    }

    const confirmation = confirm(

      "Voulez-vous vraiment supprimer cet staff ?"

    );

    if (!confirmation) {

      return;

    }

    this.utilisateurService

      .deleteUser(id)

      .subscribe({

        next: () => {

          console.log(

            "Staff supprimé"

          );

          this.loadStaff();

        },

        error: (error) => {

          console.error(

            "Erreur suppression staff :",

            error

          );

        }

      });

  }

}