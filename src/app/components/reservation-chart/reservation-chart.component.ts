import { 
  Component, 
  OnInit, 
  ViewChild, 
  ChangeDetectorRef 
} from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

import { DashboardService } from '../../services/dashboard.service';
import { ReservationStats } from '../../models/reservation-stats';


Chart.register(...registerables);


@Component({
  selector: 'app-reservation-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './reservation-chart.component.html',
  styleUrl: './reservation-chart.component.css'
})
export class ReservationChartComponent implements OnInit {


  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;



  lineChartType: 'line' = 'line';



  lineChartData: ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [

      {
        label: 'Réservations',

        data: [],

        borderWidth: 3,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 8,

        fill: false
      }

    ]

  };




  lineChartOptions: ChartConfiguration<'line'>['options'] = {


    responsive: true,

    maintainAspectRatio: false,


    scales: {

      y: {

        beginAtZero: true

      }

    },


    plugins: {

      legend: {

        display: true

      }

    }


  };




  constructor(

    private dashboardService: DashboardService,

    private cdr: ChangeDetectorRef

  ){}




  ngOnInit(): void {


    this.loadReservationStats();


  }





  loadReservationStats(): void {


    this.dashboardService.getReservationStats()

    .subscribe({


      next:(data: ReservationStats[])=>{


        console.log(
          "Statistiques réservations :",
          data
        );



        const labels = data.map(

          item => item.mois

        );



        const values = data.map(

          item => item.nombreReservations

        );



        console.log(
          "Labels :",
          labels
        );


        console.log(
          "Valeurs :",
          values
        );




        this.lineChartData = {


          labels: labels,


          datasets:[

            {

              label:'Réservations',

              data: values,


              borderWidth:3,


              tension:0.4,


              pointRadius:5,


              pointHoverRadius:8,


              fill:false

            }

          ]


        };



        setTimeout(()=>{


          this.chart?.update();


          this.cdr.detectChanges();


        });



      },



      error:(error)=>{


        console.error(

          "Erreur chargement statistiques réservations :",

          error

        );


      }


    });


  }


}