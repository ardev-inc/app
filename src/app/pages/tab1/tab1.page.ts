import { Component, OnInit, ViewChild  } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2'

//Servicios
import { AlertasService } from 'src/app/servicios/alertas.service';
import { GooglemapsService } from 'src/app/servicios/googlemaps.service';
import { ImeiService } from 'src/app/servicios/imei.service';
import { HistorialService } from 'src/app/servicios/historial.service';
import { TempHumService } from 'src/app/servicios/temp-hum.service';

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
  public seguimiento: boolean = false;
  
  public  alarma: boolean = false;
  public inclinacion: boolean = false;

  public cardTextAlarma: string = 'Desactivada';
  public cardTextInclinacion: string = 'Sin movimientos';

  public temperatura: any = 0;
  public humedad: any = 0;

  public longitud: number;
  public latitud: number;

  public imei: string;

  constructor(private alertasService: AlertasService,
    private historialService: HistorialService, 
    private imeiService: ImeiService,
    private loadingCtrl: LoadingController,
    private mapsService: GooglemapsService,
    private temp_humService: TempHumService){ }

  public ngOnInit(): void {
    this.imei = this.imeiService.getImei();
    
    this.obtenerHumedad();
    this.obtenerTemperatura();

    this.obtenerLatitud();
    this.obtenerLongitud();

    this.loadMap();

    // if(this.cargarStorage('estacionado') == 1){
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
        let date = dateTime.getDate() + '-' + `${dateTime.getMonth()+1}` + '-' + dateTime.getFullYear();
        await this.historialService.cargarAlarma(date, this.imei).toPromise();
        await this.alertasService.borrarAlarma(d.id, this.imei).toPromise();
      } else { 
        this.alarma = false;
        this.cardTextAlarma = 'Desactivada';
       }
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
        let date = dateTime.getDate() + '-' + `${dateTime.getMonth()+1}` + '-' + dateTime.getFullYear();  
        await this.historialService.cargarInclinacion(date, this.imei).toPromise();
        await this.alertasService.borrarInclinacion(d.id, this.imei).toPromise();
      } else {
        this.inclinacion = false;
        this.cardTextInclinacion = 'Sin movimientos';
      }
    });
  }

  // ------------ MAPA -------------- //
  public async loadMap(): Promise<void> {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.map = await new google.maps.Map(this.mapElement.nativeElement,
      {
        center: { lat: this.cargarStorageLatLong('latitud'), lng: this.cargarStorageLatLong('longitud') },
        zoom: 18,
        mapTypeControl: false,
        streetViewControl: false
      });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
      let marker = new google.maps.Marker({
        position: {
          lat: this.cargarStorageLatLong('latitud'),
          lng: this.cargarStorageLatLong('longitud')
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
          this.longitud = this.cargarStorageLatLong('longitud');
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
          this.latitud = this.cargarStorageLatLong('latitud')
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
      this.alertasService.vaciarInclinacion(this.imei);
      this.alertasService.vaciarAlarma(this.imei);
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
    
    // //Inclinacion
    setInterval(() => {
      if (this.estacionado) {
        this.escucharInclinacion();
      }
    }, 8000)
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
    this.loadMap();
  }

  // ------------ HUMEDAD -------------- //
  public obtenerHumedad(): void {
    this.temp_humService.getHumedad(this.imei).subscribe(async (d: any) => {
      if (d != null) {
        this.humedad = d.value;
        if (d.value.toString() != this.cargarStorage('humedad')) {
          this.humedad = d.value;
          this.borrarStorage('humedad');
          this.guardarStorage('humedad', d.value);
        }
      } else {
        let hum = this.cargarStorage('humedad');
        if(hum != null){
          this.humedad = hum.substr(1,2);
        }
      }

      if(d != null)
        await this.temp_humService.borrarHumedad(d.id, this.imei).toPromise();
    });
  }

  // ------------ TEMPERATURA -------------- //
  public obtenerTemperatura(): void {
    this.temp_humService.getTemperatura(this.imei).subscribe(async (d: any) => {
      if (d != null) {
        if (d.value.toString() != this.cargarStorage('temperatura')) {
          this.temperatura = d.value;
          this.borrarStorage('temperatura');
          this.guardarStorage('temperatura', d.value);
        }
      } else {
        let temp = this.cargarStorage('temperatura');
        if(temp != null){
          this.temperatura = temp.substr(1,2);
        }
      }

      if(d != null)
      await this.temp_humService.borrarTemperatura(d.id, this.imei).toPromise();
    });

  }

  // ------------ LOCAL STORAGE -------------- //
  public guardarStorage(key: string, value: number): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

 public cargarStorage(key: string): string {
    return localStorage.getItem(key);
  }

  public cargarStorageLatLong(key: string): number {
    return Number(localStorage.getItem(key));
  }

  public borrarStorage(key: string): void {
    localStorage.removeItem(key);
  }

}
