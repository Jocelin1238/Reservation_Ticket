export interface DashboardVoyage {

  id?: number;

  numeroVoyage: string;

  dateDepart: string;

  heureDepart: string;

  dateArrivee?: string;

  heureArrivee?: string;

  prix: number;

  placesDisponibles: number;

  nombrePlaces: number;

  statut: string;

  trajet?: {
    id?: number;
    villeDepart: string;
    villeArrivee: string;
  };

}
