import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts

@Injectable({
  providedIn: 'root'
})
export class ConfortService {

  private apiUrl = 'http://localhost:8080/api/confort';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

  constructor(private http: HttpClient) {}

  getAllConforts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}