import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  nombre: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  comenzar() {
    if(this.nombre.trim()) {
      console.log(`Usuario registrado: ${this.nombre}`);
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
        // Esto se ejecuta solo cuando el usuario cierra el Swal
        if (result.isConfirmed || result.isDismissed) {
          this.cookieService.set('nombreJugador', this.nombre);
          this.cookieService.set('estadoJuego', 'Jugando');
          this.router.navigate(['/ejercicios']);
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
