import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly apiUrl =
    'http://localhost:8080/api/tickets';

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