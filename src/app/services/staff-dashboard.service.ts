
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts

// =====================================================
// DTO VOYAGE
// =====================================================
export interface StaffVoyageDTO {

  id?: number;

  numeroVoyage?: string;

  dateDepart?: string;
  heureDepart?: string;

  dateArrivee?: string;
  heureArrivee?: string;

  prix?: number;

  nombrePlaces?: number;
  placesDisponibles?: number;

  statut?: string;

  description?: string;


  // TRAJET
  trajetId?: number;
  villeDepart?: string;
  villeArrivee?: string;


  // CONFORT
  confortId?: number;
  confort?: string;


  // TRANSPORT
  transportId?: number;
  transport?: string;
}


// =====================================================
// DTO RESERVATION
// =====================================================

export interface StaffReservationDTO {

  id?: number;

  numero?: string;

  numeroVoyage?: string;

  client?: string;

  nomClient?: string;

  prenomClient?: string;

  trajet?: string;

  statut?: string;

  dateReservation?: string;
}


// =====================================================
// DTO DASHBOARD
// =====================================================

export interface StaffDashboardDTO {

  // ===================================================
  // UTILISATEUR
  // ===================================================

  prenomStaff: string | null;


  // ===================================================
  // STATISTIQUES
  // ===================================================

  nombreVoyages: number;

  nombreReservations: number;

  nombreDeparts: number;

  ticketsScannes: number;


  // ===================================================
  // PROCHAINS DEPARTS
  // ===================================================

  prochainsDeparts: StaffVoyageDTO[];


  // ===================================================
  // RESERVATIONS RECENTES
  // ===================================================

  reservationsRecentes: StaffReservationDTO[];
}


// =====================================================
// SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class StaffDashboardService {


  private apiUrl =
    'http://localhost:8080/api/staff/dashboard';
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // RECUPERER LE DASHBOARD
  // =====================================================

  getDashboard(): Observable<StaffDashboardDTO> {

    return this.http.get<StaffDashboardDTO>(
      this.apiUrl
    );

  }

}

