import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfortService {

  private apiUrl = 'http://localhost:8080/api/confort';

  constructor(private http: HttpClient) {}

  getAllConforts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

}