import { Component, Inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import { MatButtonModule } 
from '@angular/material/button';

import { MatIconModule } 
from '@angular/material/icon';



@Component({

  selector: 'app-user-details-dialog',

  standalone: true,

  imports: [

    CommonModule,

    MatDialogModule,

    MatButtonModule,

    MatIconModule

  ],

  templateUrl: './user-details-dialog.component.html',

  styleUrl: './user-details-dialog.component.css'

})


export class UserDetailsDialogComponent {


  constructor(

    @Inject(MAT_DIALOG_DATA)
    public user: any

  ) {}


}