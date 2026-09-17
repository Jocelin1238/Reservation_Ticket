import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from '../app.constants';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  let url = req.url;
  // On remplace uniquement le domaine, on garde le /api et le reste de l'URL
  if (url.startsWith('http://localhost:8080')) {
    url = url.replace('http://localhost:8080', API_URL);
  }

  console.log("=== INTERCEPTOR ===");
  console.log("URL finale :", url, `(originale : ${req.url})`);
  console.log("TOKEN :", token);

  const headers: Record<string, string> = {
    // Plus besoin de ngrok-skip-browser-warning si vous êtes sur Render, mais ça ne gène pas
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log("Authorization ajoutée");
  } else {
    console.log("Aucun token trouvé");
  }

  const clonedReq = req.clone({
    url: url,
    setHeaders: headers
  });

  return next(clonedReq);
};