import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trajet } from '../models/trajet';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts
@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  private apiUrl = 'http://localhost:8080/api/trajets';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

  constructor(
    private http: HttpClient
  ) {}

  // ==============================
  // AFFICHER TOUS LES TRAJETS
  // ==============================

  getAllTrajets(): Observable<Trajet[]> {

    return this.http.get<Trajet[]>(
      this.apiUrl
    );

  }

  // ==============================
  // AFFICHER UN TRAJET
  // ==============================

  getById(
    id: number
  ): Observable<Trajet> {

    return this.http.get<Trajet>(
      `${this.apiUrl}/${id}`
    );

  }

  // ==============================
  // AJOUTER
  // ==============================

  ajouterTrajet(
    trajet: Trajet
  ): Observable<Trajet> {

    return this.http.post<Trajet>(
      this.apiUrl,
      trajet
    );

  }

  // ==============================
  // MODIFIER
  // ==============================

  modifierTrajet(
    id: number,
    trajet: Trajet
  ): Observable<Trajet> {

    return this.http.put<Trajet>(
      `${this.apiUrl}/${id}`,
      trajet
    );

  }

  // ==============================
  // SUPPRIMER
  // ==============================

  supprimerTrajet(
    id: number
  ): Observable<string> {

    return this.http.delete<string>(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text' as 'json'
      }
    );

  }

}