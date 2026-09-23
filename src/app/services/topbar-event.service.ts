import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { API_URL } from '../app.constants';// 👈 Ajustez le chemin '../' selon l'emplacement de votre fichier app-constants.ts


@Injectable({
  providedIn: 'root'
})
export class TopbarEventService {
private baseUrl = API_URL; // 👈 Utilise directement la constante centralisée

  private ouvrirNotificationsSource =
    new Subject<void>();

  ouvrirNotifications$ =
    this.ouvrirNotificationsSource.asObservable();


  ouvrirNotifications(): void {

    this.ouvrirNotificationsSource.next();

  }

}