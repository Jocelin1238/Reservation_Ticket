import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-bookings.component.html',
  styleUrl: './recent-bookings.component.css'
})
export class RecentBookingsComponent {

  bookings = [

    {
      client: 'Jean Dupont',
      trajet: 'Yaoundé → Douala',
      date: '23/07/2026',
      montant: '15 000 FCFA',
      statut: 'Payé'
    },

    {
      client: 'Marie Ngono',
      trajet: 'Douala → Bafoussam',
      date: '23/07/2026',
      montant: '10 000 FCFA',
      statut: 'En attente'
    },

    {
      client: 'Paul Ndzi',
      trajet: 'Yaoundé → Bertoua',
      date: '24/07/2026',
      montant: '20 000 FCFA',
      statut: 'Payé'
    }

  ];

}