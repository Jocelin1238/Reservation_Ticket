export interface Ticket {

  id: number;

  codeTicket: string;

  statut: string;

  qrCode?: string;

  dateCreation?: string;

  dateModification?: string;


  reservation?: {

    id: number;


    utilisateur?: {

      id: number;

      nom?: string;

      prenom?: string;

      nomUtilisateur?: string;

      email?: string;

      telephone?: string;

      adresse?: string;

    };


    voyage?: {

      id: number;

      numeroVoyage?: string;

      dateDepart?: string;

      heureDepart?: string;

      dateArrivee?: string;

      heureArrivee?: string;

      prix?: number;


      trajet?: {

        id: number;

        villeDepart?: string;

        villeArrivee?: string;

        distance?: number;

        duree?: string;

      };

    };


    paiements?: {

      id: number;

      montant?: number;

      methode?: string;

      statut?: string;

      referenceTransaction?: string;

      datePaiement?: string;

      dateModification?: string;

    }[];

  };

}
