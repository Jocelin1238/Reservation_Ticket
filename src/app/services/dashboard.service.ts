import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats';
import { ReservationStats } from '../models/reservation-stats';
import { DashboardReservation } 
from '../models/dashboard-reservation';
import { Utilisateur } from '../models/utilisateur';
import { DashboardVoyage } from '../models/dashboard-voyage';
import { RevenueStats } from '../models/revenue-stats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private apiUrl =
    'http://localhost:8080/api/dashboard';


  constructor(
    private http: HttpClient
  ){}



  getStats(): Observable<DashboardStats>{

    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`
    );

  }
getReservationStats(): Observable<ReservationStats[]> {

  return this.http.get<ReservationStats[]>(
    `${this.apiUrl}/reservations`
  );

}
getRecentReservations(){

 return this.http.get<DashboardReservation[]>(
   `${this.apiUrl}/recent-reservations`
 );

}
getRecentUsers(){

 return this.http.get<Utilisateur[]>(
   `${this.apiUrl}/recent-users`
 );

}
getRecentVoyages(): Observable<DashboardVoyage[]> {

  return this.http.get<DashboardVoyage[]>(
    `${this.apiUrl}/recent-voyages`
  );

}
getRevenueStats(): Observable<RevenueStats[]> {

    return this.http.get<RevenueStats[]>(
        `${this.apiUrl}/revenus`
    );

}

}
