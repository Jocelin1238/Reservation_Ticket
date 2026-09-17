import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transport } from '../models/transport';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  private apiUrl = 'http://localhost:8080/api/transports';

  constructor(private http: HttpClient) {}

  // =========================
  // LISTE
  // =========================

  getAll(): Observable<Transport[]> {

    return this.http.get<Transport[]>(this.apiUrl);

  }


  // =========================
  // PAR ID
  // =========================

  getById(id: number): Observable<Transport> {

    return this.http.get<Transport>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // AJOUTER
  // =========================

  ajouter(transport: Transport): Observable<Transport> {

    return this.http.post<Transport>(
      this.apiUrl,
      transport
    );

  }


  // =========================
  // MODIFIER
  // =========================

  modifier(
    id: number,
    transport: Transport
  ): Observable<Transport> {

    return this.http.put<Transport>(
      `${this.apiUrl}/${id}`,
      transport
    );

  }


  // =========================
  // SUPPRIMER
  // =========================

  supprimer(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}