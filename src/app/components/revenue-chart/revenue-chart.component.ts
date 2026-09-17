import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

import { DashboardService } from '../../services/dashboard.service';
import { RevenueStats } from '../../models/revenue-stats';

Chart.register(...registerables);

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.css'
})
export class RevenueChartComponent implements OnInit {

  barChartType: ChartType = 'bar';

  barChartData: ChartConfiguration['data'] = {

    labels: [],

    datasets: [
      {
        label: 'Revenus (FCFA)',

        data: [],

        borderWidth: 2
      }
    ]

  };

  barChartOptions: ChartConfiguration['options'] = {

    responsive: true,

    maintainAspectRatio: false

  };

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {

    this.loadRevenueStats();

  }

  loadRevenueStats(): void {

    this.dashboardService
      .getRevenueStats()
      .subscribe({

        next: (data: RevenueStats[]) => {

          console.log(
            'Revenus reçus :',
            data
          );

          this.barChartData = {

            labels: data.map(
              revenue => revenue.mois
            ),

            datasets: [

              {
                label: 'Revenus (FCFA)',

                data: data.map(
                  revenue => revenue.montant
                ),

                borderWidth: 2
              }

            ]

          };

        },

        error: (error) => {

          console.error(
            'Erreur récupération revenus :',
            error
          );

        }

      });

  }

}