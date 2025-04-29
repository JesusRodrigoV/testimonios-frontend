import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { provideNativeDateAdapter } from "@angular/material/core";

interface Testimony {
  id: number;
  title: string;
  description: string;
  date: Date;
  type: "text" | "audio" | "video";
  category: string;
  tags: string[];
  location: {
    name: string;
    coordinates: [number, number];
  };
  author: string;
  thumbnail: string;
  featured: boolean;
  commentsCount: number;
  likes: number;
  historicalEvent?: string;
  status: "pending" | "approved" | "restricted";
}

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export default class HomeComponent {
  isDarkMode = false;
  searchQuery = "";
  selectedCategories: string[] = [];
  selectedTypes: string[] = [];
  selectedDateRange = {
    start: null as Date | null,
    end: null as Date | null,
  };
  selectedRegion = "";

  types = ["Texto", "Audio", "Video"];

  regions = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
  ];

  testimonies: Testimony[] = [
    {
      id: 1,
      title: "Testimonio de la Guerra del Chaco",
      description:
        "Relato en primera persona de un veterano de la Guerra del Chaco, describiendo sus experiencias en el frente.",
      date: new Date("1935-06-14"),
      type: "audio",
      category: "Guerra del Chaco",
      tags: ["guerra", "militar", "historia oral"],
      location: {
        name: "Villamontes, Tarija",
        coordinates: [-21.2666, -63.4666],
      },
      author: "Juan Pérez Martínez",
      thumbnail: "/assets/images/testimonios/chaco-war.jpg",
      featured: true,
      commentsCount: 15,
      likes: 45,
      historicalEvent: "Guerra del Chaco",
      status: "approved",
    },
    {
      id: 2,
      title: "Memorias de la Revolución de 1952",
      description:
        "Documento histórico sobre la participación de mineros en la revolución nacional.",
      date: new Date("1952-04-09"),
      type: "text",
      category: "Revolución Nacional",
      tags: ["mineros", "revolución", "MNR"],
      location: {
        name: "Siglo XX, Potosí",
        coordinates: [-18.4521, -66.5877],
      },
      author: "María Mamani",
      thumbnail: "/assets/images/testimonios/revolution-52.jpg",
      featured: true,
      commentsCount: 23,
      likes: 67,
      historicalEvent: "Revolución Nacional de 1952",
      status: "approved",
    },
    // Agrega más testimonios según sea necesario
  ];

  // Datos de ejemplo
  documents = [
    {
      id: 1,
      title: "Acta de Independencia",
      description:
        "Documento original del acta de independencia de Bolivia. Un testimonio histórico de la fundación de la República.",
      date: new Date("1825-08-06"),
      category: "Documentos Históricos",
      thumbnail:
        "https://images.unsplash.com/photo-1524513058-1841349c3e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      commentsCount: 15,
    },
    {
      id: 2,
      title: "Fotografías de la Guerra del Chaco",
      description:
        "Colección de fotografías que documentan momentos cruciales durante la Guerra del Chaco (1932-1935).",
      date: new Date("1932-09-15"),
      category: "Fotografías",
      thumbnail:
        "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      commentsCount: 8,
    },
    {
      id: 3,
      title: "Mapa de la Real Audiencia de Charcas",
      description:
        "Mapa histórico que muestra las divisiones territoriales durante el período colonial.",
      date: new Date("1780-01-01"),
      category: "Mapas",
      thumbnail:
        "https://images.unsplash.com/photo-1582573732277-c5444fa37391?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      commentsCount: 23,
    },
    {
      id: 4,
      title: "Manuscrito de la Primera Constitución",
      description:
        "Manuscrito original de la primera constitución política del Estado boliviano.",
      date: new Date("1826-11-19"),
      category: "Manuscritos",
      thumbnail:
        "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      commentsCount: 12,
    },
  ];

  categories = [
    "Documentos Históricos",
    "Fotografías",
    "Manuscritos",
    "Mapas",
    "Periódicos",
  ];

  viewDocument(document: any) {
    console.log("Ver documento:", document);
  }
}
