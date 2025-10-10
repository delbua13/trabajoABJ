import { Injectable } from "@angular/core";
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class Guardian implements CanActivate {

  private readonly ESTADO_JUGANDO = 'Jugando';
  private readonly ESTADO_FINALIZADO = 'Finalizado';

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const estadoActual = this.cookieService.get('estadoJuego') || '';
    const rutaActual = state.url;

    // Rutas protegidas
    const rutasEjercicios = ['/ejercicios'];
    const rutasResultados = ['/resultados'];

    // Usuario sin estado
    if (!estadoActual && (rutasEjercicios.includes(rutaActual) || rutasResultados.includes(rutaActual))) {
      this.router.navigate(['/']);
      return false;
    }

    // Usuario jugando
    if (estadoActual === this.ESTADO_JUGANDO && !rutasEjercicios.includes(rutaActual)) {
      this.router.navigate(['/ejercicios']);
      return false;
    }

    // Usuario finalizado
    if (estadoActual === this.ESTADO_FINALIZADO && !rutasResultados.includes(rutaActual)) {
      this.router.navigate(['/resultados']);
      return false;
    }

    return true;
  }
}
