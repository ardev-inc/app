import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Licencia } from '../clases/Licencia.class';
import { Vtv } from '../clases/Vtv.class';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocumentacionService {

  private URL: string = `https://proyecto-ardev.firebaseio.com/`;


  constructor(private http: HttpClient) { }

  //CRUD Licencias
  public crearLicencia(licencia: Licencia, imei: string): Observable<Licencia> {
    return this.http.post(`${this.URL}/${imei}/Documentacion.json`, licencia)
      .pipe(map((resp: any) => {
        licencia.id = resp.name;
        return licencia;
      }));
  }

  public actualizarLicencia(licencia: Licencia, imei: string): Observable<Object> {
    return this.http.put(`${this.URL}/${imei}/Documentacion/${licencia.id}.json`, licencia);
  }

  public borrarLicencia(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Documentacion/${id}.json`);
  }

  //CRUD VTV
  public crearVTV(vtv: Vtv, imei: string): Observable<Object> {
    return this.http.post(`${this.URL}/${imei}/Documentacion.json`, vtv);
  }

  public actualizarVTV(vtv: Vtv, imei: string): Observable<Object> {
    return this.http.put(`${this.URL}/${imei}/Documentacion/${vtv.id}.json`, vtv);
  }

  public borrarVTV(id: string, imei: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${imei}/Documentacion/${id}.json`);
  }

  // Obtener lista de documentos
  public getDocumentos(imei: string): Observable<any[]> {
    return this.http.get(`${this.URL}/${imei}/Documentacion.json`)
      .pipe(map(resp => {
        return this.crearLista(resp); //Se devuelve la lista de objetos de Firebase
      }));
  }

  private crearLista(documentosObj: object): any[] {
    const documentos: any[] = [];

    if (documentosObj === null) { return []; }

    Object.keys(documentosObj).forEach(key => {  //Por cada key de cada registro 
      const doc: any = documentosObj[key];        //guardo una instancia de ese registro 
      doc.id = key;   //me guardo la key                            

      documentos.push(doc);                       //y lo agrego a la coleccion
    })

    return documentos;
  }

}
