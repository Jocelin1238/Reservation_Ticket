import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, shareReplay, catchError, finalize } from 'rxjs';

import { voyages } from '../models/voyages';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts

// =====================================================
// DTO VOYAGE
// =====================================================

export interface StaffVoyageDTO {

  id?: number;

  numeroVoyage?: string;

  dateDepart?: string;
  heureDepart?: string;

  dateArrivee?: string;
  heureArrivee?: string;

  prix?: number;

  nombrePlaces?: number;
  placesDisponibles?: number;

  statut?: string;

  description?: string;

  // TRAJET
  trajetId?: number;
  villeDepart?: string;
  villeArrivee?: string;

  // CONFORT
  confortId?: number;
  confort?: string;

  // TRANSPORT
  transportId?: number;
  transport?: string;
}


@Injectable({
  providedIn: 'root'
})
export class VoyageService {

  // =====================================================
  // ENDPOINT NORMAL
  // =====================================================

  private apiUrl =
    'http://localhost:8080/api/voyages';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée


  // =====================================================
  // ENDPOINT STAFF
  // =====================================================

  private staffApiUrl =
    'http://localhost:8080/api/staff/voyages';


  // =====================================================
  // CACHE
  // =====================================================

  private voyagesCache$?: Observable<StaffVoyageDTO[]>;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // TOUS LES VOYAGES
  // =====================================================

  getAllVoyages(): Observable<StaffVoyageDTO[]> {

    // Si les données sont déjà en cache,
    // on ne refait pas la requête HTTP.
    if (!this.voyagesCache$) {

      this.voyagesCache$ = this.http
        .get<StaffVoyageDTO[]>(this.apiUrl)
        .pipe(

          // Garde la dernière réponse
          shareReplay(1),

          // En cas d'erreur, on détruit le cache
          catchError(error => {

            this.voyagesCache$ = undefined;

            throw error;

          })

        );

    }

    return this.voyagesCache$;
  }


  // =====================================================
  // FORCER LE RAFRAÎCHISSEMENT
  // =====================================================

  refreshVoyages(): Observable<StaffVoyageDTO[]> {

    this.voyagesCache$ = this.http
      .get<StaffVoyageDTO[]>(this.apiUrl)
      .pipe(

        shareReplay(1),

        catchError(error => {

          this.voyagesCache$ = undefined;

          throw error;

        })

      );

    return this.voyagesCache$;
  }


  // =====================================================
  // VOYAGES STAFF
  // =====================================================

  getAllVoyagesStaff(): Observable<StaffVoyageDTO[]> {

    return this.http.get<StaffVoyageDTO[]>(
      this.staffApiUrl
    );

  }


  // =====================================================
  // VOYAGE PAR ID
  // =====================================================

  getVoyageById(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================================
  // AJOUTER
  // =====================================================

  ajouterVoyage(
    voyage: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      voyage
    ).pipe(

      // On invalide le cache après modification
      tap(() => {

        this.voyagesCache$ = undefined;

      })

    );

  }


  // =====================================================
  // MODIFIER
  // =====================================================

  modifierVoyage(
    id: number,
    voyage: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      voyage
    ).pipe(

      tap(() => {

        this.voyagesCache$ = undefined;

      })

    );

  }


  // =====================================================
  // SUPPRIMER
  // =====================================================

  supprimerVoyage(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType: 'text'
      }
    ).pipe(

      tap(() => {

        this.voyagesCache$ = undefined;

      })

    );

  }


  // =====================================================
  // VOYAGES DU JOUR
  // =====================================================

  getVoyagesDuJour(): Observable<voyages[]> {

    return this.http.get<voyages[]>(
      `${this.apiUrl}/du-jour`
    );

  }

}