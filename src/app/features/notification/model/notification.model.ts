interface Testimonio {
  titulo: string;
}

interface Estado {
  nombre: string;
}

export interface Notificacion {
  id_notificacion: number;
  mensaje: string;
  id_testimonio: number;
  id_usuario: number;
  id_estado: number;
  fecha_creacion: string;
  leido: boolean;
  testimonios: Testimonio;
  estado: Estado;
}