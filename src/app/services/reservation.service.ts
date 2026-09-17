import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: number;
  dateReservation: string;
  statut: string;

  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };

  voyage: {
    id: number;
    numeroVoyage: string;
    dateDepart?: string;
    heureDepart?: string;
    dateArrivee?: string;
    heureArrivee?: string;
    prix?: number;

    trajet?: {
      villeDepart: string;
      villeArrivee: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getMesReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/mes-reservations`
    );
  }

  reserver(voyageId: number): Observable<Reservation> {
    return this.http.post<Reservation>(
      `${this.apiUrl}/${voyageId}`,
      {}
    );
  }
}