
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Notification {

  id: number;

  message: string;

  type: string;

  lu: boolean;

  dateCreation: string;

}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private apiUrl =
    'http://localhost:8080/api/notifications';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // TOUTES LES NOTIFICATIONS
  // ==========================================

  getNotifications(): Observable<Notification[]> {

    return this.http.get<Notification[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // NOTIFICATIONS NON LUES
  // ==========================================

  getNotificationsNonLues(): Observable<Notification[]> {

    return this.http.get<Notification[]>(
      `${this.apiUrl}/non-lues`
    );

  }


  // ==========================================
  // NOMBRE DE NOTIFICATIONS NON LUES
  // ==========================================

  getNombreNotifications(): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/count`
    );

  }


  // ==========================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // ==========================================

  marquerCommeLue(
    id: number
  ): Observable<Notification> {

    return this.http.patch<Notification>(
      `${this.apiUrl}/${id}/read`,
      {}
    );

  }


  // ==========================================
  // MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  // ==========================================

  marquerToutesCommeLues(): Observable<void> {

    return this.http.patch<void>(
      `${this.apiUrl}/read-all`,
      {}
    );

  }


  // ==========================================
  // SUPPRIMER UNE NOTIFICATION
  // ==========================================

  supprimerNotification(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}
