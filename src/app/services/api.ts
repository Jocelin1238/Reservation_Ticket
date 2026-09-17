import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; // Ou juste '/api' si vous utilisez le proxy

  constructor(private http: HttpClient) {}

  // Exemple pour récupérer des données ou vous connecter
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}