
export interface voyages {

  id: number;

  numeroVoyage: string;

  dateDepart: string;

  heureDepart: string;

  dateArrivee?: string;

  heureArrivee?: string;

  prix: number;

  nombrePlaces: number;

  placesDisponibles: number;

  statut: string;

  description?: string;

  trajet?: {
    id: number;
    villeDepart?: string;
    villeArrivee?: string;
    distance?: number;
    duree?: string;
  };

  confort?: {
    id: number;
    nom?: string;
    description?: string;
  };

  transport?: {
    id: number;
    nom?: string;
    type?: string;
  };

  dateCreation?: string;

  dateModification?: string;
}


