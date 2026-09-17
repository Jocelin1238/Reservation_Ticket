import { Component, Inject } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';


import {
 MAT_DIALOG_DATA,
 MatDialogRef,
 MatDialogModule
} from '@angular/material/dialog';


import { CommonModule } from '@angular/common';

import { MatFormFieldModule } 
from '@angular/material/form-field';

import { MatInputModule }
from '@angular/material/input';

import { MatButtonModule }
from '@angular/material/button';

import { MatSelectModule }
from '@angular/material/select';



@Component({

selector:'app-edit-user-dialog',

standalone:true,

imports:[

CommonModule,
ReactiveFormsModule,
MatDialogModule,
MatFormFieldModule,
MatInputModule,
MatButtonModule,
MatSelectModule

],

templateUrl:'./edit-user-dialog.component.html',

styleUrl:'./edit-user-dialog.component.css'

})


export class EditUserDialogComponent {


userForm:FormGroup;



constructor(

private fb:FormBuilder,

private dialogRef:MatDialogRef<EditUserDialogComponent>,

@Inject(MAT_DIALOG_DATA) public user:any

){


this.userForm=this.fb.group({

nom:[user.nom,Validators.required],

prenom:[user.prenom,Validators.required],

email:[user.email,[Validators.required,Validators.email]],

telephone:[user.telephone],

adresse:[user.adresse],

role:[

user.roles?.[0]?.role || 'ROLE_USER',

Validators.required

],

motDePasse:['']

});


}



save(){


if(this.userForm.invalid){

return;

}



this.dialogRef.close(

this.userForm.value

);


}



close(){

this.dialogRef.close();

}


}