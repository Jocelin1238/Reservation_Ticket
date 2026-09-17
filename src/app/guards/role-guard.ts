
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('==============================');
  console.log('🛡️ ROLE GUARD');
  console.log('URL demandée :', state.url);

  const loggedIn = authService.isLoggedIn();

  console.log('🔐 Connecté :', loggedIn);

  if (!loggedIn) {

    console.log('❌ Utilisateur non connecté');

    router.navigate(['/login']);

    return false;
  }

  const role = authService.getUserRole();

  console.log('👤 Rôle récupéré :', role);

  const rolesAutorises =
    route.data?.['roles'] || [];

  console.log(
    '🎯 Rôles autorisés :',
    rolesAutorises
  );

  console.log(
    '✅ Rôle autorisé ?',
    rolesAutorises.includes(role)
  );

  if (rolesAutorises.includes(role)) {

    console.log('🟢 ACCÈS AUTORISÉ À :', state.url);

    return true;
  }

  console.warn(
    '🚫 ACCÈS REFUSÉ POUR LE RÔLE :',
    role
  );

  switch (role) {

    case 'ROLE_STAFF':
      console.log('➡️ Redirection dashboard staff');
      router.navigate(['/dashboard-staff']);
      break;

    case 'ROLE_ADMIN':
      console.log('➡️ Redirection dashboard admin');
      router.navigate(['/dashboard-admin']);
      break;

    case 'ROLE_SUPER_ADMIN':
      console.log('➡️ Redirection dashboard superadmin');
      router.navigate(['/dashboard-superadmin']);
      break;

    case 'ROLE_USER':
      console.log('➡️ Redirection dashboard user');
      router.navigate(['/accueil']);
      break;

    default:
      console.log('❌ Rôle inconnu :', role);
      router.navigate(['/login']);
  }

  return false;
};