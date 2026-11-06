import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Utilisateur } from './models/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {



  private apiUrl =
  'http://localhost:8080/api/utilisateurs';



  constructor(
    private http: HttpClient
  ) {}





  // ==================================
  // Récupérer tous les utilisateurs
  // ==================================

  getUsers(): Observable<Utilisateur[]> {


    return this.http.get<Utilisateur[]>(

      this.apiUrl

    );


  }




searchUsers(
  keyword: string
): Observable<Utilisateur[]> {

  return this.http.get<Utilisateur[]>(

    `${this.apiUrl}/recherche?keyword=${keyword}`

  );

}
// ==================================
// Récupérer les administrateurs
// ==================================

getAdministrateurs(): Observable<Utilisateur[]> {

  return this.http.get<Utilisateur[]>(

    `${this.apiUrl}/admins`

  );

}

// ==================================
// Récupérer le staff
// ==================================

getStaff(): Observable<Utilisateur[]> {

  return this.http.get<Utilisateur[]>(

    `${this.apiUrl}/staff`

  );

}

  // ==================================
  // Récupérer un utilisateur par ID
  // ==================================

  getUserById(
    id:number
  ): Observable<Utilisateur> {


    return this.http.get<Utilisateur>(

      `${this.apiUrl}/${id}`

    );


  }






  // ==================================
  // Ajouter un utilisateur
  // ==================================

  createUser(
    utilisateur: Utilisateur
  ): Observable<Utilisateur> {


    return this.http.post<Utilisateur>(

      this.apiUrl,

      utilisateur

    );


  }






  // ==================================
  // Modifier un utilisateur
  // ==================================

  updateUser(
    id:number,
    utilisateur:Utilisateur
  ): Observable<Utilisateur> {


    return this.http.put<Utilisateur>(

      `${this.apiUrl}/${id}`,

      utilisateur

    );


  }






  // ==================================
  // Supprimer un utilisateur
  // ==================================

  deleteUser(
    id:number
  ): Observable<void> {


    return this.http.delete<void>(

      `${this.apiUrl}/${id}`

    );


  }





}