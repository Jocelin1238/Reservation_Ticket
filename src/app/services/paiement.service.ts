import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paiement {
  id: number;
  montant: number;
  methode: string;
  statut: string;
  referenceTransaction: string;
  datePaiement: string;
  dateModification?: string;

  reservation?: {
    id: number;
    statut?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:8080/api/paiements';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // LISTE DES PAIEMENTS
  // =========================

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }

  // =========================
  // PAIEMENT PAR ID
  // =========================

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // PAIEMENTS D'UNE RESERVATION
  // =========================

  getPaiementsReservation(
    reservationId: number
  ): Observable<Paiement[]> {

    return this.http.get<Paiement[]>(
      `${this.apiUrl}/reservation/${reservationId}`
    );
  }

  // =========================
  // CREER UN PAIEMENT
  // =========================

  creerPaiement(
    reservationId: number,
    montant: number,
    methode: string
  ): Observable<Paiement> {

    return this.http.post<Paiement>(
      `${this.apiUrl}/${reservationId}?montant=${montant}&methode=${methode}`,
      {}
    );
  }

  // =========================
  // VALIDER UN PAIEMENT
  // =========================

  validerPaiement(
    id: number
  ): Observable<Paiement> {

    return this.http.put<Paiement>(
      `${this.apiUrl}/${id}/valider`,
      {}
    );
  }

  // =========================
  // MODIFIER LE STATUT
  // =========================

  modifierStatut(
    id: number,
    statut: string
  ): Observable<Paiement> {

    return this.http.put<Paiement>(
      `${this.apiUrl}/${id}/statut?statut=${statut}`,
      {}
    );
  }

  // =========================
  // RECHERCHER PAR REFERENCE
  // =========================

  chercherParReference(
    reference: string
  ): Observable<Paiement> {

    return this.http.get<Paiement>(
      `${this.apiUrl}/reference/${reference}`
    );
  }

}