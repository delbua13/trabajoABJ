import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario, UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  nombre: string = '';

  usuarios:Usuario[] = [];

  constructor(private router: Router, private cookieService: CookieService, private usuariosService:UsuariosService) {}

  comenzar() {
    if(this.nombre.trim()) {
      this.usuariosService.obtenerUsuarios().subscribe({
        next: (data: Usuario[]) => {
          this.usuarios = data;
  
          // Verificamos si el nombre ya existe
          const nombreExistente = this.usuarios.some(u => u.name.toLowerCase() === this.nombre.toLowerCase());
  
          if (nombreExistente) {
            Swal.fire({
              title: 'Nombre ya utilizado',
              text: 'Por favor elige otro nombre.',
              icon: 'warning',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'neon-swal',
                title: 'neon-swal-title',
                confirmButton: 'neon-swal-btn'
              },
              background: 'transparent',
              color: '#fff'
            });
          } else {
            // Nombre disponible: mostramos mensaje de bienvenida
            Swal.fire({
              title: 'Bienvenido ' + this.nombre + '!',
              text: 'Comencemos la aventura.',
              confirmButtonText: '¡Vamos allá!',
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
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                this.cookieService.set('nombreJugador', this.nombre);
                this.cookieService.set('estadoJuego', 'Jugando');
                this.router.navigate(['/ejercicios']);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los usuarios.',
            icon: 'error'
          });
        }
      });
    }
  }

  randomPosition() {
    return Math.random() * 100;
  }
  
  randomSpeed() {
    return 8 + Math.random() * 6; // entre 8 y 14 segundos
  }
  
  randomDelay() {
    return Math.random() * 8;
  }
  
}
