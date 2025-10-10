import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseDeDatosService {

  private titulosPreguntas: string[] = [
    "🎮 ¿Qué es el aprendizaje basado en juegos?",
    "🏆 ¿Cuáles son los principales beneficios del ABJ?",
    "🧩 ¿Qué elementos de un juego se pueden aplicar al aprendizaje?",
    "💡 ¿Cómo fomenta el ABJ el pensamiento crítico y la creatividad?",
    "📣 ¿Qué papel juega la retroalimentación en el ABJ?",
    "🎲 ¿Cuáles son ejemplos de juegos educativos efectivos?",
    "📊 ¿Cómo se mide el éxito del aprendizaje basado en juegos?",
    "🔄 ¿Cuál es la diferencia entre gamificación y ABJ?",
    "🧠 ¿Cómo se puede adaptar un juego a distintos estilos de aprendizaje?",
    "⚠️ ¿Qué retos enfrenta la implementación del ABJ en el aula?"
  ];

  private todasFrases: string[] = [
    "El ABJ utiliza mecánicas de juego para motivar y comprometer a los estudiantes, fomentando el aprendizaje activo, a diferencia de la enseñanza tradicional más pasiva.",
    "Mejora la motivación, el compromiso, la retención de conocimientos, el desarrollo de habilidades sociales y la capacidad de resolución de problemas.",
    "Puntos, niveles, retos, recompensas, retroalimentación inmediata y narrativa atractiva son elementos que se pueden integrar al aprendizaje.",
    "Presenta desafíos y problemas que requieren estrategia, innovación y toma de decisiones dentro de un contexto lúdico.",
    "La retroalimentación permite corregir errores, aprender de ellos y mejorar continuamente, manteniendo la motivación alta.",
    "Juegos de simulación, videojuegos educativos, juegos de mesa adaptados a contenidos escolares y aplicaciones gamificadas son ejemplos efectivos.",
    "Se evalúa a través de la comprensión de conceptos, habilidades adquiridas, participación activa y desempeño en evaluaciones tradicionales.",
    "La gamificación aplica mecánicas de juego a entornos no lúdicos, mientras que el ABJ utiliza juegos completos con objetivos educativos claros.",
    "Incluyendo retos visuales, auditivos, kinestésicos, colaborativos y personalizados según el nivel y estilo de los estudiantes.",
    "Limitaciones de tiempo, recursos tecnológicos, formación docente, resistencia al cambio y equilibrar diversión y aprendizaje."
  ];

  constructor() { }

  getEjercicios(): string[] {
    return this.todasFrases;
  }

  getTitulosPreguntas():string[]{
    return this.titulosPreguntas;
  }
}
