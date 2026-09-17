import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface VerifyAccountRequest {
  email: string;
  otp: string;
}

export interface AuthenticationResponse {
  token: string | null;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // LOGIN
  // =====================================================

  login(data: any): Observable<AuthenticationResponse> {

    console.log(
      '🔵 REQUETE LOGIN ENVOYEE :',
      JSON.stringify(data)
    );

    return this.http
      .post<AuthenticationResponse>(
        `${this.apiUrl}/login`,
        data
      )
      .pipe(

        tap((response: AuthenticationResponse) => {

          console.log(
            '✅ REPONSE BACKEND LOGIN :',
            response
          );

          // =================================================
          // TOKEN
          // =================================================

          if (response?.token) {

            this.saveToken(
              response.token
            );

          }

          // =================================================
          // ROLE
          // =================================================

          let role: string | null =
            response?.role || null;

          if (role) {

            role =
              String(role)
                .toUpperCase();

          }

          console.log(
            '👤 ROLE DETECTE :',
            role
          );

          // =================================================
          // UTILISATEUR
          // =================================================

          const utilisateur = {

            email:
              response?.email || '',

            nom:
              response?.nom || '',

            prenom:
              response?.prenom || '',

            role:
              role

          };

          console.log(
            '💾 UTILISATEUR SAUVEGARDE :',
            utilisateur
          );

          localStorage.setItem(
            'utilisateur',
            JSON.stringify(utilisateur)
          );

        })

      );

  }


  // =====================================================
  // REGISTER
  // =====================================================

  register(
    data: any
  ): Observable<AuthenticationResponse> {

    console.log(
      '📤 REQUETE REGISTER ENVOYEE :',
      data
    );

    return this.http.post<AuthenticationResponse>(
      `${this.apiUrl}/register`,
      data
    );

  }


  // =====================================================
  // VERIFY ACCOUNT
  // =====================================================

  verifyAccount(
    data: VerifyAccountRequest
  ): Observable<string> {

    console.log(
      '📤 VERIFICATION COMPTE ENVOYEE :',
      data
    );

    return this.http.post<string>(
      `${this.apiUrl}/verify-account`,
      data,
      {
        responseType: 'text' as 'json'
      }
    );

  }


  // =====================================================
  // RESEND OTP
  // =====================================================

  resendOtp(
    email: string
  ): Observable<string> {

    console.log(
      '📤 DEMANDE RENVOI OTP :',
      email
    );

    return this.http.post<string>(
      `${this.apiUrl}/resend-otp`,
      null,
      {
        params: {
          email: email
        },
        responseType: 'text' as 'json'
      }
    );

  }


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  forgotPassword(
    data: any
  ): Observable<string> {

    return this.http.post<string>(
      `${this.apiUrl}/forgot-password`,
      data,
      {
        responseType: 'text' as 'json'
      }
    );

  }


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  resetPassword(
    data: any
  ): Observable<string> {

    return this.http.post<string>(
      `${this.apiUrl}/reset-password`,
      data,
      {
        responseType: 'text' as 'json'
      }
    );

  }


  // =====================================================
  // VALIDATE TOKEN
  // =====================================================

  validateToken(
    token: string
  ): Observable<boolean> {

    return this.http.get<boolean>(
      `${this.apiUrl}/validate`,
      {
        params: {
          token: token
        }
      }
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'utilisateur'
    );

    localStorage.removeItem(
      'user'
    );

  }


  // =====================================================
  // TOKEN
  // =====================================================

  saveToken(
    token: string
  ): void {

    localStorage.setItem(
      'token',
      token
    );

  }


  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );

  }


  // =====================================================
  // UTILISATEUR
  // =====================================================

  getUtilisateur(): any | null {

    const utilisateur =
      localStorage.getItem(
        'utilisateur'
      );

    if (!utilisateur) {

      return null;

    }

    try {

      return JSON.parse(
        utilisateur
      );

    } catch (error) {

      console.error(
        '❌ ERREUR LECTURE UTILISATEUR :',
        error
      );

      return null;

    }

  }


  // =====================================================
  // NOM COMPLET
  // =====================================================

  getUserName(): string {

    const utilisateur =
      this.getUtilisateur();

    if (!utilisateur) {

      return 'Utilisateur';

    }

    const nom =
      utilisateur.nom || '';

    const prenom =
      utilisateur.prenom || '';

    const nomComplet =
      `${prenom} ${nom}`.trim();

    return (
      nomComplet ||
      utilisateur.email ||
      'Utilisateur'
    );

  }


  // =====================================================
  // ROLE
  // =====================================================

  getUserRole(): string {

    const utilisateur =
      this.getUtilisateur();

    if (
      !utilisateur ||
      !utilisateur.role
    ) {

      return '';

    }

    return String(
      utilisateur.role
    ).toUpperCase();

  }


  // =====================================================
  // CONNECTE ?
  // =====================================================

  isLoggedIn(): boolean {

    return this.getToken() !== null;

  }

}