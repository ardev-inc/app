import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private URL: string = `https://proyecto-ardev.firebaseio.com/`;

  constructor(private http: HttpClient) { }

  //CRUD alarma
  public cargarAlarma(date: string, imei: string): Observable<Object> {
    return this.http.post(`${this.URL}/${imei}/Historial/Alarma/.json`, JSON.stringify(date));
  }

  public borrarAlarma(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Historial/Alarma/${id}.json`);
  }

  //CRUD inclinacion
  public cargarInclinacion(date: string, imei: string): Observable<Object> {
    return this.http.post(`${this.URL}/${imei}/Historial/Inclinacion/.json`, JSON.stringify(date));
  }

  public borrarInclinacion(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Historial/Inclinacion//${id}.json`);
  }

  // Obtener lista de alarmas
  public getAlarmas(imei: string): Observable<any[]> {

    return this.http.get(`${this.URL}/${imei}/Historial/Alarma/.json`)
      .pipe(map(resp => {
        return this.crearLista(resp); //Se devuelve la lista de objetos de Firebase
      }));

  }

  // Obtener lista de inclinaciones
  public getInclinaciones(imei: string): Observable<any[]> {

    return this.http.get(`${this.URL}/${imei}/Historial/Inclinacion/.json`)
      .pipe(map(resp => {
        return this.crearLista(resp); //Se devuelve la lista de objetos de Firebase
      }));

  }

  private crearLista(alertasObj: object): any[] {

    const alertas: any[] = [];

    if (alertasObj === null) { return []; }

    Object.keys(alertasObj).forEach(key => {  //Por cada key de cada registro 
      const alert: any = {
        value: alertasObj[key], //guardo una instancia de ese registro
        id: key                 //me guardo la key  
      };

      alertas.push(alert);      //y lo agrego a la coleccion
    })

    return alertas;
  }

}
