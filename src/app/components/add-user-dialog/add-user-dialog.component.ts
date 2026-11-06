import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } 
from '@angular/material/form-field';

import { MatInputModule } 
from '@angular/material/input';

import { MatButtonModule } 
from '@angular/material/button';

import { MatSelectModule } 
from '@angular/material/select';



@Component({

  selector: 'app-add-user-dialog',

  standalone: true,

  imports: [

    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule

  ],

  templateUrl: './add-user-dialog.component.html',

  styleUrl: './add-user-dialog.component.css'

})


export class AddUserDialogComponent {


  userForm: FormGroup;



  constructor(

    private fb: FormBuilder,

    private dialogRef: MatDialogRef<AddUserDialogComponent>

  ){


    this.userForm = this.fb.group({


      nom:[

        '',

        Validators.required

      ],


      prenom:[

        '',

        Validators.required

      ],


      email:[

        '',

        [
          Validators.required,
          Validators.email
        ]

      ],


      telephone:[

        ''

      ],


      adresse:[

        ''

      ],


      role:[

        'ROLE_USER',

        Validators.required

      ],


      motDePasse:[

        '',

        [

          Validators.required,

          Validators.minLength(8)

        ]

      ],


      confirmPassword:[

        '',

        Validators.required

      ]


    });


  }





save():void{


console.log(
  "Etat du formulaire :",
  this.userForm.value
);



if(this.userForm.invalid){

 console.log(
  "Formulaire invalide"
 );

 return;

}



const formValue = this.userForm.value;



// Vérification mot de passe

if(
 formValue.motDePasse !== formValue.confirmPassword
){

 console.log(
  "Les mots de passe ne correspondent pas"
 );

 return;

}




const utilisateur = {


 nom: formValue.nom,


 prenom: formValue.prenom,


 email: formValue.email,


 telephone: formValue.telephone,


 adresse: formValue.adresse,


 motDePasse: formValue.motDePasse,

roles: [

   {

     role: formValue.role

   }

 ]


};




console.log(
 "Utilisateur envoyé :",
 utilisateur
);



this.dialogRef.close(utilisateur);


}





close():void{

 this.dialogRef.close();

}



}