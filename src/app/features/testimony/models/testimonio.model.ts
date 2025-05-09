export interface Testimony {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  duration: number;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
  status: string;
  format: string;
  author: string;
  categories: string[];
  tags: string[];
  event?: string;
}

export interface TestimonyInput {
  title: string;
  description: string;
  content?: string;
  tags?: string[];
  categories?: string[];
  url: string;
  duration?: number;
  format: string;
  eventId?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface TestimonyVersion {
  version: number;
  changes: { tipo: string; detalles: string };
  editedAt: string;
  editor: string;
}

export interface MapPoint {
  id: number;
  title: string;
  coordinates: [number, number];
} 