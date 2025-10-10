import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { BaseDeDatosService } from '../services/base-de-datos.service';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  nombreJugador: string = '';
  puntuacion: number = 0;
  soluciones: string[] = [];
  preguntas: string[] = [];

  constructor(private cookieService: CookieService, private router: Router, private baseDeDatosService:BaseDeDatosService) {}

  ngOnInit(): void {
    // Leer datos desde cookies
    this.nombreJugador = this.cookieService.get('nombreJugador') || 'Jugador';
    this.puntuacion = Number(this.cookieService.get('puntuacion')) || 0;
    this.soluciones = this.baseDeDatosService.getEjercicios();
    this.preguntas = this.baseDeDatosService.getTitulosPreguntas();
  }

  volverAJugar(): void {
    // Borrar todas las cookies
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
