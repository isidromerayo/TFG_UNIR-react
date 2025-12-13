/**
 * Type definitions for the application
 * Replaces all 'any' types with proper interfaces
 */

// User types
export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  username?: string;
  fullname?: string;
  estado?: string;
  password?: string;
}

export interface UsuarioResponse {
  token: string;
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  username: string;
  fullname: string;
}

// Course types
export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  valoracionMedia: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  instructo?: boolean;
  instructor?: Instructor;
}

export interface CursoEmbedded {
  _embedded: {
    cursos: Curso[];
  };
}

// Category types
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaEmbedded {
  _embedded: {
    categorias: Categoria[];
  };
}

// Instructor types
export interface Instructor {
  id: number;
  nombre: string;
  apellidos: string;
  descripcion?: string;
}

// Rating/Valoracion types
export interface Valoracion {
  id: number;
  comentario: string;
  puntuacion: number;
  fecha?: string;
  curso?: Curso;
  alumno?: Usuario;
}

export interface ValoracionEmbedded {
  _embedded: {
    valoraciones: Valoracion[];
  };
}

// Cart types
export interface CartItem {
  id: number;
  titulo: string;
  precio: number;
  quantity: number;
  descripcion?: string;
  valoracionMedia?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// API Response types
export interface ApiError {
  message?: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
  status?: number;
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Array<{
        message: string;
        field?: string;
      }>;
    };
  };
  code?: string;
  config?: {
    url?: string;
  };
}

// Next.js getServerSideProps types
export interface NextPageContext {
  query: {
    id?: string;
    [key: string]: string | string[] | undefined;
  };
}

export interface NextRequestResponse {
  req: {
    headers: {
      [key: string]: string | string[] | undefined;
    };
  };
  res: {
    writeHead: (status: number, headers: { Location: string }) => void;
    end: () => void;
  };
}

// Form types
export interface FormInputEvent {
  target: {
    name: string;
    value: string;
  };
}

export interface FormSubmitEvent {
  preventDefault: () => void;
}

// Home page data types
export interface HomePageData {
  cursos_mas_valorados: Curso[];
  valoraciones_cursos: Valoracion[];
  cursos_actualizados: Curso[];
}

