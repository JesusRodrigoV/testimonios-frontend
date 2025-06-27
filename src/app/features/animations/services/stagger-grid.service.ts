import { Injectable } from "@angular/core";

export interface Circle {
  visible: boolean;
}

@Injectable({
  providedIn: "root",
})
export class StaggerGridService {
  agregarCirculos(array: Circle[], cantidad: number, visibles: boolean) {
    for (let i = 0; i < cantidad; i++) {
      var circulo: Circle = { visible: visibles };
      array.push(circulo);
    }
  }
  agregarBloque(
    matriz: Circle[][],
    largo: number,
    alto: number,
    visibles: boolean
  ) {
    let fila: Circle[] = [];
    for (let j = 0; j < alto; j++) {
      fila = [];
      for (let i = 0; i < largo; i++) {
        var circulo: Circle = { visible: visibles };
        fila.push(circulo);
      }
      matriz.push(fila);
    }
    
  }

  agregarFila(matriz: Circle[][], fila: Circle[]) {
    matriz.push(fila);
  }

  limpiarArray(array: Circle[]) {
    return (array = []);
  }
}
