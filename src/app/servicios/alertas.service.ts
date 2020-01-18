import { Injectable } from '@angular/core';
import { Observable, Observer } from "rxjs"
import { HttpClient } from '@angular/common/http';


import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  private URL: string = `https://proyecto-ardev.firebaseio.com/`;


  constructor(private http: HttpClient) { }

  public ngOnInit(): void { }

  //Observer alarma
  public getAlarma(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenAlarma(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenAlarma(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Alarma/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarAlarma(id: string, imei: string): Observable<any> {
    return this.http.delete(`${this.URL}/${imei}/Alarma/${id}.json`);
  }

  public getAlarmas(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenAlarmas(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenAlarmas(imei: string): Observable<any[]> {
    return this.http.get(`${this.URL}/${imei}/Alarma/.json`)
      .pipe(
        map(resp => {
          return this.mapeoTodaLaLista(resp);
        })
      );
  }

  public async vaciarAlarma(imei: string): Promise<void> {
    await this.getAlarmas(imei).subscribe(async (d: any[]) => {
      if (d) {
        for (let i = 0; i <= d.length - 1; i++)
          this.borrarAlarma(d[i].id, imei).toPromise();
      }
    });
  }

  //Observer inclinacion
  public getInclinacion(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenInclinacion(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenInclinacion(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Inclinacion/.json`)
      .pipe(
        map(resp => {
          return this.mapeoDato(resp);
        })
      );
  }

  public borrarInclinacion(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Inclinacion/${id}.json`);
  }

  public getInclinaciones(imei: string): Observable<any> {
    return new Observable<any>((observer: Observer<any>): void => {
      this.listenInclinaciones(imei).toPromise()
        .then((d: any) => observer.next(d))
        .catch((err: any) => observer.error(err));
    });
  }

  private listenInclinaciones(imei: string): Observable<any> {
    return this.http.get(`${this.URL}/${imei}/Inclinacion/.json`)
      .pipe(
        map(resp => {
          return this.mapeoTodaLaLista(resp);
        })
      );
  }

  public async vaciarInclinacion(imei: string): Promise<void> {
    await this.getInclinaciones(imei).subscribe(async (d: any[]) => {
      if (d) {
        for (let i = 0; i <= d.length - 1; i++)
          this.borrarInclinacion(d[i].id, imei).toPromise();
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

  private mapeoTodaLaLista(datoObj: object): any[] {
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
