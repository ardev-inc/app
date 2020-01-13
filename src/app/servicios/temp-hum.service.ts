import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from "rxjs"

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class TempHumService {

  private URL: string = `https://proyecto-ardev.firebaseio.com/`;

  constructor(private http: HttpClient) { }

  //TEMPERATURA
  public getTemperatura(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenTemperatura(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenTemperatura(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Temp_Hum/Temperatura/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarTemperatura(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Temp_Hum/Temperatura/${id}.json`);
  }

  //HUMEDAD
  public getHumedad(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenHumedad(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenHumedad(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Temp_Hum/Humedad/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarHumedad(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Temp_Hum/Humedad/${id}.json`);
  }

  //MAPPER
  private mapeoDato(datoObj: object): any {
    let datos: any[] = [];

    if (datoObj === null) { return null; }

    //Por cada key de cada registro 
    Object.keys(datoObj).forEach(key => {

      let dato: any = {
        id: null,
        value: null
      }

      dato.value = datoObj[key];        //guardo una instancia de ese registro 
      dato.id = key;                   //me guardo la key                                                                 
      datos.push(dato);                //y lo agrego a la coleccion
    })

    return datos[0];
  }
}
