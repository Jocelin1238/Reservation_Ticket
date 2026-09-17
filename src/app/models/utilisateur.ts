export interface Role {

    id?: number;

    role:
    | 'ROLE_SUPER_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_STAFF'
    | 'ROLE_USER';

}
export interface Utilisateur {

    id?: number;

    nom: string;

    prenom: string;

    email: string;

    telephone: string;

    adresse?: string;

    photo?: string;

    motDePasse?: string;

    actif?: boolean;

 
  roles: Role[];

    dateCreation: string;



}