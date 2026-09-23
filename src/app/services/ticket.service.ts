import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket } from '../models/ticket';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly apiUrl =
    'http://localhost:8080/api/tickets';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // LISTE DES TICKETS
  // ==========================================

  getAllTickets(): Observable<Ticket[]> {

    return this.http.get<Ticket[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // VERIFIER UN TICKET
  // ==========================================

  verifierTicket(code: string): Observable<Ticket> {

    return this.http.get<Ticket>(
      `${this.apiUrl}/verifier/${encodeURIComponent(code)}`
    );

  }


  // ==========================================
  // SCANNER / UTILISER UN TICKET
  // ==========================================

  scannerTicket(code: string): Observable<Ticket> {

    return this.http.put<Ticket>(
      `${this.apiUrl}/scanner/${encodeURIComponent(code)}`,
      {}
    );

  }


  // ==========================================
  // RECHERCHER PAR ID
  // ==========================================

  getTicketById(id: number): Observable<Ticket> {

    return this.http.get<Ticket>(
      `${this.apiUrl}/${id}`
    );

  }

}