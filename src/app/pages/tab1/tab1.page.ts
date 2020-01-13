import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { TempHumService } from 'src/app/servicios/temp-hum.service';
import { LoadingController } from '@ionic/angular';
import { GooglemapsService } from 'src/app/servicios/googlemaps.service';

import Swal from 'sweetalert2'
import { ImeiService } from 'src/app/servicios/imei.service';
import { HistorialService } from 'src/app/servicios/historial.service';

declare var google;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  @ViewChild('mapElement') mapElement;
  public map;

  public estacionado: boolean = false;

  public inclinacion: boolean = false;
  public  alarma: boolean = false;

  public cardTextAlarma: string = 'Desactivada';
  public cardTextInclinacion: string = 'Sin movimientos';

  public temperatura: number = 0;
  public humedad: number = 0;

  public seguimiento: boolean = false;
  public longitud: number;
  public latitud: number;

  public imei: string;

  constructor(private alertasService: AlertasService,
    private loadingCtrl: LoadingController,
    private temp_humService: TempHumService,
    private mapsService: GooglemapsService,
    private imeiService: ImeiService,
    private historialService: HistorialService) {

  }

  public ngOnInit(): void {
    this.imei = this.imeiService.getImei();
    
    this.obtenerHumedad();
    this.obtenerTemperatura();

    this.obtenerLatitud();
    this.obtenerLongitud();

    // this.loadMap();

    // if(this.cargarStorage('estacionado')==1){
    //   this.estacionado = true
    // }
  }

  // ------------ ALARMA -------------- //
  public async escucharAlarma(): Promise<void> {
    await this.alertasService.getAlarma(this.imei).subscribe(async (d: any) => {
      if (d && d.value) {
        this.alarma = true;
        this.cardTextAlarma = 'Activada';
        await Swal.fire({
          type: 'error',
          title: 'Se activó la alarma del vehículo',
          animation: true,
          customClass: {
            popup: 'animated tada'
          }
        })
        let dateTime = new Date();
        let date = dateTime.getDate() + '-' + dateTime.getMonth()+1 + '-' + dateTime.getFullYear();
        await this.historialService.cargarAlarma(date, this.imei).toPromise();
        // await this.alertasService.borrarAlarma(d.id, this.imei).toPromise(); PARA BORRAR
      } else { 
        this.alarma = false;
        this.cardTextAlarma = 'Desactivada';
       }
      console.log('this alarma', this.alarma);
    });
  }

  // ------------ INCLINACION -------------- //
  public async escucharInclinacion(): Promise<void> {
    await this.alertasService.getInclinacion(this.imei).subscribe(async (d: any) => {
      if (d && d.value) {
        this.inclinacion = true;
        this.cardTextInclinacion = 'Probable robo de ruedas o acarreo';
        await Swal.fire({
          type: 'error',
          title: 'Se detectan movimientos extraños en tu vehículo',
          animation: true,
          customClass: {
            popup: 'animated tada'
          }
        })
        let dateTime = new Date();
        let date = dateTime.getDate() + '-' + dateTime.getMonth()+1 + '-' + dateTime.getFullYear();  
        await this.historialService.cargarInclinacion(date, this.imei).toPromise();
        //  await this.alertasService.borrarInclinacion(d.id, this.imei).toPromise(); // PARA BORRAR
      } else {
        this.inclinacion = false;
        this.cardTextInclinacion = 'Sin movimientos';
      }
      console.log('this inclinacion', this.inclinacion);
    });
  }

  // ------------ MAPA -------------- //
  public async loadMap(): Promise<void> {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.map = await new google.maps.Map(this.mapElement.nativeElement,
      {
        center: { lat: this.cargarStorage('latitud'), lng: this.cargarStorage('longitud') },
        zoom: 18,
        mapTypeControl: false,
        streetViewControl: false
      });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
      let marker = new google.maps.Marker({
        position: {
          lat: this.cargarStorage('latitud'),
          lng: this.cargarStorage('longitud')
        },
        zoom: 18,
        map: this.map
      })

    });

  }

  public obtenerLongitud(): void {
    this.mapsService.getLongitud(this.imei).subscribe(async (d: any) => {
      if (d) {
        if (d.value != this.cargarStorage('longitud')) {
          this.longitud = d.value;
          this.borrarStorage('longitud');
          this.guardarStorage('longitud', this.longitud);

        }
        else {
          this.longitud = this.cargarStorage('longitud');
        }

        // await this.mapsService.borrarLongitud(d.id, this.imei).toPromise();
      }
    });
  }

  public obtenerLatitud(): void {
    this.mapsService.getLatitud(this.imei).subscribe(async (d: any) => {
      if (d) {
        if (d.value != this.cargarStorage('latitud')) {
          this.latitud = d.value;
          this.borrarStorage('latitud');
          this.guardarStorage('latitud', this.latitud);
        }
        else {
          this.longitud = this.cargarStorage('latitud');
        }

        //  await this.mapsService.borrarLatitud(d.id, this.imei).toPromise();
      }
    });
  }

  // ------------ MODO ESTACIONADO -------------- //
  public cambiarEstadoEstacionado(): void {
    if (this.estacionado) {
      this.estacionado = false;
      this.borrarStorage('estacionado'); //borro del storage el estado
      this.inclinacion = false;
      this.alarma = false;
      this.cardTextAlarma = 'Desactivada';
      this.cardTextInclinacion = 'Sin movimientos';
      Swal.fire({
        type: 'error',
        title: 'Modo estacionado desactivado',
        animation: true,
        customClass: {
          popup: 'animated tada'
        }
      })
    } else {
      this.estacionado = true;
      this.guardarStorage('estacionado', 1); //guardo en el storage por si la aplicación se cierra y al volverla a abrir aparezca activado
      // this.alertasService.vaciarInclinacion(this.imei);
      // this.alertasService.vaciarAlarma(this.imei);
      Swal.fire({
        type: 'success',
        title: 'Modo estacionado activado',
        animation: true,
        customClass: {
          popup: 'animated tada'
        }
      })
    }

    // //Alarma
    setInterval(() => {
      if (this.estacionado) {
        this.escucharAlarma();
      }
    }, 6000)
    // // this.escucharAlarma();

    // //Inclinacion
    setInterval(() => {
      if (this.estacionado) {
        this.escucharInclinacion();
      }
    }, 8000)
    // //this.escucharInclinacion();
  }

  // ------------ MODO UBICACION EN TIEMPO REAL -------------- //
  public cambiarEstadoSeguimiento(): void {
    if (this.seguimiento) {
      this.seguimiento = false;
      Swal.fire({
        type: 'error',
        title: 'Ubicación en tiempo real desactivada',
        animation: true,
        customClass: {
          popup: 'animated tada'
        }
      })
    } else {
      this.seguimiento = true;
      // this.mapsService.vaciarLatitud(this.imei);
      // this.mapsService.vaciarLongitud(this.imei);
      Swal.fire({
        type: 'success',
        title: 'Ubicación en tiempo real activada',
        animation: true,
        customClass: {
          popup: 'animated tada'
        }
      })
    }

    setInterval(() => {
      if (this.seguimiento) {
        this.obtenerLatitud();
        this.obtenerLongitud();

        this.loadMap();
      }
    }, 5000)
    // // this.loadMap();
  }

  // ------------ HUMEDAD -------------- //
  public obtenerHumedad(): void {
    this.temp_humService.getHumedad(this.imei).subscribe(async (d: any) => {
      if (d) {
        this.humedad = d.value;
        if (d.value != this.cargarStorage('humedad')) {
          this.humedad = d.value;
          this.borrarStorage('humedad');
          this.guardarStorage('humedad', this.humedad);
        }
        else {
          this.humedad = this.cargarStorage('humedad');
        }
      }

      //await this.temp_humService.borrarHumedad(d.id, this.imei).toPromise(); PARA BORRAR
    });
  }

  // ------------ TEMPERATURA -------------- //
  public obtenerTemperatura(): void {
    this.temp_humService.getTemperatura(this.imei).subscribe(async (d: any) => {
      if (d) {
        if (d.value != this.cargarStorage('temperatura')) {
          this.temperatura = d.value;
          this.borrarStorage('temperatura');
          this.guardarStorage('temperatura', this.temperatura);
        }
        else {
          this.temperatura = this.cargarStorage('temperatura');
        }

        //await this.temp_humService.borrarTemperatura(d.id, this.imei).toPromise(); PARA BORRAR
      }
    });

  }

  // ------------ LOCAL STORAGE -------------- //
  public guardarStorage(key: string, value: number): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

 public cargarStorage(key: string): number {
    return Number(localStorage.getItem(key));
  }

  public borrarStorage(key: string): void {
    localStorage.removeItem(key);
  }

}
