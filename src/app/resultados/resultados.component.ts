import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  nombreJugador: string = '';
  puntuacion: number = 0;
  frasesAcertadas: string[] = [];

  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {
    // Leer datos desde cookies
    this.nombreJugador = this.cookieService.get('nombreJugador') || 'Jugador';
    this.puntuacion = Number(this.cookieService.get('puntuacion')) || 0;
    this.frasesAcertadas = this.cookieService.check('frasesAcertadas')
      ? JSON.parse(this.cookieService.get('frasesAcertadas'))
      : [];
  }

  volverAJugar(): void {
    // Borrar todas las cookies
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
