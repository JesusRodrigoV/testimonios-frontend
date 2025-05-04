export interface Testimony {
  id: number;
  title: string;
  description: string;
  content: string;
  mediaUrl: string; // Changed from 'url'
  duration: number;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  status: string;
  mediaType: string; // Changed from 'format'
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
  mediaUrl: string; // Changed from 'url'
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
