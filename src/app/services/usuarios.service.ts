import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const API_URL = 'https://servertrabajoabj.vercel.app/usuarios'; 

export interface Usuario {
  id?: number;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: Usuario): Observable<void> {
    return this.http.post<void>(API_URL, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(API_URL);
  }

  actualizarScore(id: number, score: number): Observable<Usuario[]> {
    return this.http.put<Usuario[]>(`${API_URL}/${id}`, { score });
  }
}
