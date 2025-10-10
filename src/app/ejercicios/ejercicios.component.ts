import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseDeDatosService } from '../services/base-de-datos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface ParteEjercicio {
  texto: string;
  numero: number;
}

@Component({
  selector: 'app-ejercicios',
  imports: [CommonModule, FormsModule],
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css']
})
export class EjerciciosComponent implements OnInit {

  ejercicios: string[] = [];
  titulos: string[] = [];
  ejercicioActual: string = '';
  indiceEjercicio: number = 0;
  particionFrase: number = 8;

  partesEjercicio: ParteEjercicio[] = [];
  ordenUsuario: string = '';

  puntuacion: number = 0;
  frasesAcertadas: string[] = [];

  

  constructor(
    private baseDeDatosService: BaseDeDatosService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ejercicios = this.baseDeDatosService.getEjercicios();
    this.titulos = this.baseDeDatosService.getTitulosPreguntas();

    // Leer cookies
    this.indiceEjercicio = Number(this.cookieService.get('indice')) || 0;
    this.puntuacion = Number(this.cookieService.get('puntuacion')) || 0;
    this.frasesAcertadas = this.cookieService.check('frasesAcertadas')
      ? JSON.parse(this.cookieService.get('frasesAcertadas'))
      : [];

    // Inicializar ejercicio actual
    if (this.indiceEjercicio < this.ejercicios.length) {
      this.ejercicioActual = this.ejercicios[this.indiceEjercicio];
      this.inicializarEjercicio();
    }
  }

  private generarNumerosAleatorios(): number[] {
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = numeros.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }
    return numeros;
  }

  inicializarEjercicio() {
    this.ordenUsuario = '';
    const texto = this.ejercicioActual;
    const longitudTotal = texto.length;
    const tamañoParte = Math.ceil(longitudTotal / this.particionFrase);

    const partes: ParteEjercicio[] = [];
    let inicio = 0;

    for (let i = 0; i < this.particionFrase; i++) {
      const fin = Math.min(inicio + tamañoParte, longitudTotal);
      const fragmento = texto.slice(inicio, fin);
      partes.push({ texto: fragmento, numero: 0 });
      inicio = fin;
    }

    const numerosAleatorios = this.generarNumerosAleatorios();
    partes.forEach((parte, idx) => parte.numero = numerosAleatorios[idx]);
    partes.sort((a, b) => a.numero - b.numero);

    this.partesEjercicio = partes;
  }

  verificarOrden(intento: string) {
    if (intento.trim() === this.ejercicioActual.trim()) {
      this.puntuacion += 100;
      this.frasesAcertadas.push(this.ejercicioActual);
      Swal.fire({
        title: '🎉 ¡Correcto!',
        text: 'Has acertado la frase y ganas 100 puntos.',
        icon: 'success',
        customClass: {
          popup: 'neon-swal',
          title: 'neon-swal-title',
          confirmButton: 'neon-swal-btn',
          cancelButton: 'neon-swal-btn-cancel'
        },
        background: 'transparent',
        confirmButtonColor: '#4CAF50',
        color: '#fff'
      });

      this.pasarAlSiguiente();
    } else {
      this.puntuacion -= 10;
      Swal.fire({
        title: '❌ Incorrecto',
        text: 'Pierdes 10 puntos, intenta de nuevo.',
        icon: 'error',
        customClass: {
          popup: 'neon-swal',
          title: 'neon-swal-title',
          confirmButton: 'neon-swal-btn',
          cancelButton: 'neon-swal-btn-cancel'
        },
        background: 'transparent',
        confirmButtonColor: '#d33',
        color: '#fff'
      });
    }

    this.actualizarCookies();
  }

  pasarSiguienteEjercicio() {
    Swal.fire({
      title: '¿Pasar al siguiente?',
      text: 'No ganarás puntos, pero se mostrará la solución abajo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      background: '#1b1f24',
      color: '#fff'
    }).then(result => {
      if (result.isConfirmed) {
        // Añadimos la frase actual al historial (como mostrada)
        this.frasesAcertadas.push(this.ejercicioActual);

        Swal.fire({
          title: 'ℹ️ Ejercicio saltado',
          text: 'Se ha mostrado la solución, pero no obtienes puntos.',
          icon: 'info',
          customClass: {
            popup: 'neon-swal',
            title: 'neon-swal-title',
            confirmButton: 'neon-swal-btn',
            cancelButton: 'neon-swal-btn-cancel'
          },
          background: 'transparent',
          confirmButtonColor: '#3085d6',
          color: '#fff'
        });

        this.pasarAlSiguiente();
      }
    });
  }

  private pasarAlSiguiente() {
    const index = this.indiceEjercicio+1; 
    if (index < this.ejercicios.length) {
      this.indiceEjercicio++;
      this.ejercicioActual = this.ejercicios[this.indiceEjercicio];
      this.inicializarEjercicio();
      this.actualizarCookies();
    } else {

      this.cookieService.set('estadoJuego', 'Finalizado');
      this.actualizarCookies();
      Swal.fire({
        title: '🏁 ¡Juego completado!',
        text: 'Has terminado todos los ejercicios. ¡Enhorabuena!',
        icon: 'success',
        customClass: {
          popup: 'neon-swal',
          title: 'neon-swal-title',
          confirmButton: 'neon-swal-btn',
          cancelButton: 'neon-swal-btn-cancel'
        },
        background: 'transparent',
        confirmButtonColor: '#4CAF50'
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          this.router.navigate(['/resultados']);
        }
      });
    }
  }
  @ViewChild('ordenInput') ordenInput!: ElementRef;
  agregarTexto(parte: ParteEjercicio) {
    this.ordenUsuario += parte.texto;
    setTimeout(() => {
      const input = this.ordenInput.nativeElement;
      input.scrollLeft = input.scrollWidth;
    });
  }

  private actualizarCookies() {
    this.cookieService.set('indice', this.indiceEjercicio.toString());
    this.cookieService.set('puntuacion', this.puntuacion.toString());
    this.cookieService.set('frasesAcertadas', JSON.stringify(this.frasesAcertadas));
  }

  randomPosition() {
    return Math.random() * 100;
  }
  
  randomSpeed() {
    return 8 + Math.random() * 6;
  }
  
  randomDelay() {
    return Math.random() * 8;
  }
 
  
}
