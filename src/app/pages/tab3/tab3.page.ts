import { Component, OnInit } from '@angular/core';
import { ImeiService } from 'src/app/servicios/imei.service';
import Swal from 'sweetalert2'

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HistorialService } from 'src/app/servicios/historial.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public imei: string;
  public cargado: boolean = false;

  public anio: number;

  public alarmas: any[] = [];
  public inclinaciones: any[] = [];

  constructor(private imeiService: ImeiService, private iab: InAppBrowser, private historialService: HistorialService) {
    this.anio = new Date().getFullYear();
  }

  public ngOnInit(): void {
    this.imei = this.imeiService.getImei();
    if (this.imei != 'null') {
      this.cargado = true;
    } else {
      this.imei = "";
    }

   this.leerHistorial();
  }

  public crearIMEI(): void {
    this.imeiService.setImei(this.imei);
    this.cargado = true;

    Swal.fire({
      type: 'success',
      title: 'Su IMEI se ha guardado exitosamente',
      text: 'Por favor, reinicie la aplicación para guardar los cambios',
      animation: true,
      customClass: {
        popup: 'animated tada'
      }
    })
  }

 public borrarIMEI(): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esto no puede revertirse",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si!',
      cancelButtonText: 'Me arrepenti'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          '¡Eliminado!',
          'Su IMEI fue eliminado',
          'success'
        )
        this.imeiService.borrarImei();
        this.cargado = false;
        this.imei = "";
      }
    })
  }

  public abrirWeb(): void {
    const browser = this.iab.create('https://www.buenosaires.gob.ar/tramites/retiro-del-vehiculo-acarreado-por-grua', '_system');
    browser.show();
  }

  public async leerHistorial(): Promise<void>{
    this.alarmas = await this.historialService.getAlarmas(this.imei).toPromise();
    this.inclinaciones = await this.historialService.getInclinaciones(this.imei).toPromise();
  }

  private async loadPage(): Promise<void> {
    this.alarmas = await this.historialService.getAlarmas(this.imei).toPromise();
    this.inclinaciones = await this.historialService.getInclinaciones(this.imei).toPromise();
  }

  public async eliminarAlarma(id: string): Promise<void> {
    await this.historialService.borrarAlarma(id, this.imei).toPromise();
    this.loadPage();
  }

  public async eliminarInclinacion(id: string): Promise<void> {
    await this.historialService.borrarInclinacion(id, this.imei).toPromise();
    this.loadPage();
  }

}
