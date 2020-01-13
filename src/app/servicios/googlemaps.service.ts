import { Injectable } from '@angular/core';
import { Observable, Observer } from "rxjs"
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GooglemapsService {

  private URL: string = `https://proyecto-ardev.firebaseio.com/`;

  constructor(private http: HttpClient) { }

  // LATITUD
  public getLatitud(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenLatitud(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenLatitud(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Ubicacion/Latitud/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarLatitud(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Ubicacion/Latitud/${id}.json`);
  }

  public getLatitudes(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenLatitudes(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenLatitudes(imei: string): Observable<any[]> {
    return this.http.get(`${this.URL}/${imei}/Ubicacion/Latitud/.json`)
      .pipe(
        map(resp => {
          return this.mapeoTodaLaLista(resp);
        })
      );
  }

  public async vaciarLatitud(imei: string): Promise<void> {
    await this.getLatitudes(imei).subscribe(async (d: any[]) => {
      for (let i of d) {
        this.borrarLatitud(i.id, imei).toPromise();
      }
    });
  }

  //LONGITUD
  public getLongitud(imei: string): Observable<Object> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenLongitud(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenLongitud(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Ubicacion/Longitud/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarLongitud(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Ubicacion/Longitud/${id}.json`);
  }

  public getLongitudes(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenLongitudes(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenLongitudes(imei: string): Observable<any[]> {
    return this.http.get(`${this.URL}/${imei}/Ubicacion/Longitud/.json`)
      .pipe(
        map(resp => {
          return this.mapeoTodaLaLista(resp);
        })
      );
  }

  public async vaciarLongitud(imei: string): Promise<void> {
    await this.getLongitudes(imei).subscribe(async (d: any[]) => {
      for (let i of d) {
        this.borrarLongitud(i.id, imei).toPromise();
      }
    });
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

  public mapeoTodaLaLista(datoObj: object): any[] {
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
    return datos;
  }

}
