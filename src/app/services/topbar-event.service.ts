import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopbarEventService {

  private ouvrirNotificationsSource =
    new Subject<void>();

  ouvrirNotifications$ =
    this.ouvrirNotificationsSource.asObservable();


  ouvrirNotifications(): void {

    this.ouvrirNotificationsSource.next();

  }

}