import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transport } from '../models/transport';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts
@Injectable({
  providedIn: 'root'
})
export class TransportService {

  private apiUrl = 'http://localhost:8080/api/transports';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

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