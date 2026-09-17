export interface Transport {

  id?: number;

  nom: string;

  type: 'BUS' | 'AVION' | 'TRAIN';

  capacite: number;

  statut: string;
}
