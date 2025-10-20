import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseDeDatosService {

  private titulosPreguntas: string[] = [
    "🎮 ¿Qué pretende el Aprendizaje Basado en Juegos?",
    "🏆 ¿En qué se basa?",
    "🧩 ¿Cuáles son las claves para hacer un buen diseño y creación de un AJB?",
    "💡 ¿Es lo mismo ABJ que gamificación?",
    "📣 ¿Es interesante usar el ABJ para enseñar?",
    "🎲 ¿Es interesante usar el ABJ para enseñar?",
  ];

  private todasFrases: string[] = [
    "El ABJ tiene como objetivo la creación o la adaptación de juegos que impliquen un aprendizaje con fin educativo.",
    "El ABJ se basa en una alineación curricular, con participación activa y feedback inmediato, así como diversas formas de participar.",
    "Para crear un ABJ se debe seleccionar un contenido con rigor científico adecuado a la programación del curriculum específico y oculto con una evaluación que se base en la rúbrica y retroalimentación basadas en iteraciones.",
    "No, el ABJ requiere un juego completo y estructurado. Por otro lado, la gamificación suele ser un término más amplio y de mayor extensión temporal.",
    "El ABJ implica un aprendizaje activo, con alta motivación y feedback inmediato, que desarrolla una serie de habilidades clave a través de prueba-error entre otros.",
    "Sin embargo, no es oro todo lo que reluce, el ABJ puede implicar distracciones, riesgo de jugar por jugar, adicción a las tecnologías, etc.",
  ];

  constructor() { }

  getEjercicios(): string[] {
    return this.todasFrases;
  }

  getTitulosPreguntas():string[]{
    return this.titulosPreguntas;
  }
}
