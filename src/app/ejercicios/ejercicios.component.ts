import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseDeDatosService } from '../services/base-de-datos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

interface ParteEjercicio {
  texto: string;
  numero: number;
}

export interface Usuario {
  id?: number;
  name: string;
  score: number;
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
  private readonly particionFrase: number = 5;

  partesEjercicio: ParteEjercicio[] = [];
  ordenUsuario: string = '';

  name:string = '';

  puntuacion: number = 0;
  frasesAcertadas: string[] = [];

  

  constructor(
    private baseDeDatosService: BaseDeDatosService,
    private cookieService: CookieService,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.ejercicios = this.baseDeDatosService.getEjercicios();
    this.titulos = this.baseDeDatosService.getTitulosPreguntas();

    // Leer cookies
    this.indiceEjercicio = Number(this.cookieService.get('indice')) || 0;
    this.puntuacion = Number(this.cookieService.get('puntuacion')) || 0;
    this.name = String(this.cookieService.get('nombreJugador')) || "";
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
    const numeros = Array.from({ length: this.particionFrase }, (_, i) => i + 1);
    for (let i = numeros.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }
  
    return numeros;
  }

  inicializarEjercicio() {
    this.ordenUsuario = '';
    const texto = this.ejercicioActual.trim();
  
    // Dividimos la frase en palabras
    const palabras = texto.split(' ');
    const totalPalabras = palabras.length;
  
    // Calculamos cuántas palabras por parte (aproximadamente)
    const palabrasPorParte = Math.ceil(totalPalabras / this.particionFrase);
  
    const partes: ParteEjercicio[] = [];
    let indice = 0;
  
    for (let i = 0; i < this.particionFrase && indice < totalPalabras; i++) {
      const fin = Math.min(indice + palabrasPorParte, totalPalabras);
      const fragmento = palabras.slice(indice, fin).join(' ') + ' ';
      partes.push({ texto: fragmento, numero: 0 });
      indice = fin;
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
          const usuario = {
            name: this.name,
            score: this.puntuacion
          };

          this.usuariosService.crearUsuario(usuario).subscribe({
            next: (res) => {
              console.log('✅ Usuario guardado en Supabase:', res);
              this.router.navigate(['/resultados']);
            },
            error: (err) => {
              console.error('❌ Error al guardar usuario:', err);
              Swal.fire('Error', 'No se pudo guardar el usuario en la base de datos.', 'error');
            }
          });
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

  limpiarOrden() {
    this.ordenUsuario = "";
  }
 
  
}
