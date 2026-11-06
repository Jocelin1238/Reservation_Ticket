import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BrowserQRCodeReader,
  IScannerControls
} from '@zxing/browser';

import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket.service';
  


@Component({
  selector: 'app-scanner-ticket',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './scanner-ticket.component.html',
  styleUrl: './scanner-ticket.component.css'
})
export class ScannerTicket implements AfterViewInit, OnDestroy {

  @ViewChild('video', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;

  private codeReader = new BrowserQRCodeReader();

  private scannerControls?: IScannerControls;

  scanning = false;

  message = '';

  erreur = '';

  codeScanne = '';

  ticket?: Ticket;

  chargementTicket = false;

  validationEnCours = false;


  constructor(
    private ticketService: TicketService,
  private router: Router
  ) {}


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngAfterViewInit(): void {

    this.demarrerScanner();

  }


  // =====================================================
  // DEMARRER SCANNER
  // =====================================================

  async demarrerScanner(): Promise<void> {

    this.erreur = '';

    this.message = '';

    this.codeScanne = '';

    this.ticket = undefined;

    this.chargementTicket = false;

    this.scanning = true;


    try {

      this.scannerControls =
        await this.codeReader.decodeFromVideoDevice(

          undefined,

          this.videoElement.nativeElement,

          (result) => {

            if (result) {

              const code = result.getText();

              console.log(
                '📷 QR Code détecté :',
                code
              );

              this.codeScanne = code;

              this.message =
                'QR Code détecté. Vérification du ticket...';

              this.arreterScanner();

              this.verifierTicket(code);

            }

          }
        );

    } catch (error) {

      console.error(
        'Erreur caméra :',
        error
      );

      this.erreur =
        'Impossible d’accéder à la caméra. Vérifiez les permissions du navigateur.';

      this.scanning = false;

    }

  }


  // =====================================================
  // ARRETER SCANNER
  // =====================================================

  arreterScanner(): void {

    this.scanning = false;


    if (this.scannerControls) {

      this.scannerControls.stop();

      this.scannerControls = undefined;

    }

  }


  // =====================================================
  // VERIFIER TICKET
  // =====================================================

  verifierTicket(code: string): void {

    this.chargementTicket = true;

    this.erreur = '';

    this.ticket = undefined;


    this.ticketService
      .verifierTicket(code)
      .subscribe({

        next: (ticket) => {

          console.log(
            '🎫 Ticket trouvé :',
            ticket
          );

          this.ticket = ticket;

          this.chargementTicket = false;

          this.message =
            'Ticket trouvé avec succès.';

        },

        error: (error) => {

          console.error(
            'Erreur vérification ticket :',
            error
          );

          this.chargementTicket = false;

          this.ticket = undefined;

          if (error.status === 404) {

            this.erreur =
              'Ticket introuvable. QR Code invalide.';

          } else {

            this.erreur =
              'Impossible de vérifier le ticket.';

          }

        }

      });

  }


  // =====================================================
  // VALIDER / SCANNER LE TICKET
  // =====================================================

  validerTicket(): void {

    if (!this.codeScanne) {

      return;

    }


    this.validationEnCours = true;

    this.erreur = '';


    this.ticketService
      .scannerTicket(this.codeScanne)
      .subscribe({

        next: (ticket) => {

          console.log(
            '✅ Ticket utilisé :',
            ticket
          );

          this.ticket = ticket;

          this.validationEnCours = false;

          this.message =
            'Ticket validé avec succès.';

        },

        error: (error) => {

          console.error(
            'Erreur validation ticket :',
            error
          );

          this.validationEnCours = false;


          if (error.status === 500) {

            this.erreur =
              'Ce ticket est peut-être déjà utilisé ou invalide.';

          } else {

            this.erreur =
              'Impossible de valider le ticket.';

          }

        }

      });

  }


  // =====================================================
  // NOUVEAU SCAN
  // =====================================================

  nouveauScan(): void {

    this.ticket = undefined;

    this.codeScanne = '';

    this.message = '';

    this.erreur = '';

    this.chargementTicket = false;

    this.validationEnCours = false;

    this.demarrerScanner();

  }


  // =====================================================
  // DESTRUCTION
  // =====================================================

  ngOnDestroy(): void {

    this.arreterScanner();

  }
retourDashboard(): void {
  this.router.navigate(['/dashboard-staff']);
}
}