import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

  constructor(private http: HttpClient) {}

  // Exemple pour récupérer des données ou vous connecter
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}