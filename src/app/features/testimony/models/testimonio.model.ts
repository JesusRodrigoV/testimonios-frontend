export interface Testimony {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string; // Changed from 'url'
  duration: number | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  status: string;
  author: string;
  categories: string[];
  tags: string[];
  event?: string;
}

export interface TestimonyInput {
  title: string;
  description: string;
  content: string;
  tags?: string[];
  categories?: string[];
  eventId?: number;
  latitude?: number;
  longitude?: number;
  url: string; // Changed from 'url'
  duration?: number;
  format: string; // Expected to be 'video' or 'audio'
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
