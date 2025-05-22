export interface ForoTema {
  id_forotema: number;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  creado_por_id_usuario: number;
  id_evento?: number;
  id_testimonio?: number;
  usuarios?: {
    id_usuario: number;
    nombre: string;
    email: string;
    profile_image?: string;
  };
  eventos_historicos?: {
    id_evento: number;
    nombre: string;
  };
  testimonios?: {
    id_testimonio: number;
    titulo: string;
  };
}