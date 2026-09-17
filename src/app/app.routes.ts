import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { VoyagesComponent } from './pages/gestion-voyages/voyages.component'; 
import { ReservationComponent } from './pages/reservation/reservation.component';
import { PaiementComponent } from './pages/paiement/paiement.component';
import { TicketsComponent } from './pages/ticket/tickets.component';
import { StaffComponent } from './pages/staff/staff.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardUserComponent } from './pages/dashboard-user/dashboard-user.component';
import { DashboardStaffComponent } 
from './pages/dashboard-staff/dashboard-staff.component';

import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DashboardSuperadminComponent } from './pages/dashboard-superadmin/dashboard-superadmin.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { AdministrateursComponent } from './pages/administrateurs/administrateurs.component.'; 
import { TransportComponent } from './pages/transport/transport.component';
import { TrajetComponent } from './pages/trajet/trajet.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { roleGuard } from './guards/role-guard';
import { ScannerTicket } from './pages/scanner-ticket/scanner-ticket.component'; 
import { TicketDetailComponent }
  from './pages/ticket-detail/ticket-detail.component';
  import { DepartDuJourComponent } from './pages/depart-du-jour/depart-du-jour.component';
  import { ReservationsUserComponent } from './pages/reservations-user/reservations-user.component';
import { TicketsUserComponent } from './pages/tickets-user/tickets-user.cmponent';
  import { PaiementsUserComponent } from './pages/paiements-user/paiements-user.component'; 
  import { VoyagesUserComponent } from './pages/voyages-user/voyages-user.component';
   import { VoyageUserDetailComponent } from './pages/voyage-user-detail/voyage-user-detail.component'; 
import { RegisterComponent } from './pages/register/register.component';
import { VerifyAccountComponent } from './pages/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [

  // =====================================================
  // AUTHENTIFICATION
  // =====================================================

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'verify-account',
    component: VerifyAccountComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'voyage-user-detail/:id',
    component: VoyageUserDetailComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },


  // =====================================================
  // ACCUEIL
  // =====================================================

  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  },

  {
    path: 'accueil',
    component: AccueilComponent
  },


  // =====================================================
  // DASHBOARD USER
  // =====================================================

  {
    path: 'dashboard-user',
    component: DashboardUserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // DASHBOARD STAFF
  // =====================================================

  {
    path: 'dashboard-staff',
    component: DashboardStaffComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_STAFF']
    }
  },


  // =====================================================
  // DASHBOARD ADMIN
  // =====================================================

  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },


  // =====================================================
  // DASHBOARD SUPER ADMIN
  // =====================================================

  {
    path: 'dashboard-superadmin',
    component: DashboardSuperadminComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_SUPER_ADMIN']
    }
  },


  // =====================================================
  // VOYAGES USER
  // =====================================================

  {
    path: 'voyages',
    component: VoyagesUserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },

  {
    path: 'voyages/:id',
    component: VoyageUserDetailComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // GESTION DES VOYAGES
  // STAFF + ADMIN + SUPER ADMIN
  // =====================================================

  {
    path: 'gestion-voyages',
    component: VoyagesComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_STAFF',
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
  // RESERVATIONS USER
  // =====================================================

  {
    path: 'reservations-user',
    component: ReservationsUserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // RESERVATIONS STAFF / ADMIN / SUPER ADMIN
  // =====================================================

  {
    path: 'reservations',
    component: ReservationComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_STAFF',
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
  // PAIEMENTS USER
  // =====================================================

  {
    path: 'paiements-user',
    component: PaiementsUserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // PAIEMENTS ADMIN
  // =====================================================

  {
    path: 'admin/paiement',
    component: PaiementComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
  // TICKETS USER
  // =====================================================

  {
    path: 'tickets-user',
    component: TicketsUserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // TICKETS ADMIN
  // =====================================================

  {
    path: 'admin/tickets',
    component: TicketsComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
  // DETAIL TICKET
  // =====================================================

  {
    path: 'tickets/:id',
    component: TicketDetailComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['ROLE_USER']
    }
  },


  // =====================================================
  // STAFF
  // =====================================================

  {
    path: 'staff/depart-du-jour',
    component: DepartDuJourComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_STAFF',
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },

  {
    path: 'staff/scanner',
    component: ScannerTicket,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_STAFF',
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
  // ADMIN
  // =====================================================

  {
    path: 'admin/voyages',
    component: VoyagesComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },

  {
    path: 'admin/reservations',
    component: ReservationComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },

  {
    path: 'admin/utilisateurs',
    component: UtilisateursComponent,
    canActivate: [roleGuard],
    data: {
      roles: [
        'ROLE_ADMIN',
        'ROLE_SUPER_ADMIN'
      ]
    }
  },


  // =====================================================
// PARAMÈTRES CLIENT
// =====================================================

{
  path: 'parametres',
  component: ParametresComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ROLE_USER']
  }
},

// =====================================================
// PARAMÈTRES STAFF
// =====================================================

{
  path: 'staff/parametres',
  component: ParametresComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ROLE_STAFF']
  }
},

// =====================================================
// PARAMÈTRES ADMIN
// =====================================================

{
  path: 'admin/parametres',
  component: ParametresComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ROLE_ADMIN']
  }
},

// =====================================================
// PARAMÈTRES SUPER ADMIN
// =====================================================

{
  path: 'superadmin/parametres',
  component: ParametresComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['ROLE_SUPER_ADMIN']
  }
},


  // =====================================================
  // AUTRES PAGES
  // =====================================================

  {
    path: 'profil',
    component: ProfilComponent
  },

  {
    path: 'administrateurs',
    component: AdministrateursComponent
  },

  {
    path: 'utilisateurs',
    component: UtilisateursComponent
  },

  {
    path: 'transport',
    component: TransportComponent
  },

  {
    path: 'trajet',
    component: TrajetComponent
  },

  {
    path: 'staff',
    component: StaffComponent
  },


  // =====================================================
  // MAUVAISE URL
  // =====================================================

  {
    path: '**',
    redirectTo: 'accueil'
  }

];