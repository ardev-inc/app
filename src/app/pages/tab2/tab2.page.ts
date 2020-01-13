import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

//Clases
import { Licencia } from 'src/app/clases/Licencia.class';
import { Vtv } from 'src/app/clases/Vtv.class';

//Servicios
import { DocumentacionService } from 'src/app/servicios/documentacion.service';
import { ImeiService } from 'src/app/servicios/imei.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  public imei: string;

  public tipo: boolean = true;

  public vencido: boolean = false;
  public aVencerse: boolean = false;

  public documentos: any[] = [];

  public form: any = {
    licencia: {
      apellido: null,
      nombre: null,
      numeroLicencia: null,
      vencimiento: null
    },
    vtv: {
      numeroLicencia: null,
      vencimiento: null
    }
  };

  constructor(private documentacionService: DocumentacionService, private imeiService: ImeiService) {
  }

  public ngOnInit(): void {
    this.imei = this.imeiService.getImei();

    this.loadPage();
  }

  // Para seleccionar el tipo de formulario
  public cambiarTipo(): void {
    this.tipo = !this.tipo;
  }

  //Guardo Licencia
  public async logForm(): Promise<any> {
        
      let licencia = new Licencia(this.form.licencia.nombre, this.form.licencia.apellido, this.form.licencia.numeroLicencia, this.form.licencia.vencimiento);

      if (licencia.nombre === "" || licencia.apellido == ""
        || licencia.numeroLicencia == "" || licencia.vencimiento == null) {
          return Swal.fire({
            type: 'warning',
            title: 'Complete todos los campos',
          })
      } else {
      await this.documentacionService.crearLicencia(licencia, this.imei).toPromise();

      this.loadPage();

      this.form.licencia.apellido = "";
      this.form.licencia.nombre = "";
      this.form.licencia.numeroLicencia = "";
      this.form.licencia.vencimiento = "";
    }
  };

  //Guardo VTV
  public async logFormVTV(): Promise<any> {

    let vtv = new Vtv(this.form.vtv.patente, this.form.vtv.vencimiento);

    if (this.form.vtv.patente == "" || this.form.vtv.vencimiento == null) {
      return Swal.fire({
        type: 'warning',
        title: 'Complete todos los campos',
      })
    } else {

      await this.documentacionService.crearVTV(vtv, this.imei).toPromise();

      this.loadPage();

      this.form.vtv.patente = "";
      this.form.vtv.vencimiento = "";
    }
  }

  //Documentación Vencida
  public documentosPorVencerse(): Promise<any> {
    return Swal.fire({
      type: 'warning',
      title: 'Documentación por vencerse',
      text: '¡Uno o más documentos estan por vencerse en pocos dias!',
    })
  }

  public documentosVencidos(): Promise<any> {
    return Swal.fire({
      type: 'error',
      title: 'Documentación vencida',
      text: '¡Uno o más documentos estan vencidos!',
    })
  }

  public async calcularVencido(): Promise<void> {

    let fechaHoy: Date = new Date();

    for (let doc of this.documentos) {

      let vencimiento: Date = new Date(doc.vencimiento)

      //Obtengo la diferencia de dias
      let diff = Math.abs(vencimiento.getTime() - fechaHoy.getTime());
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (fechaHoy.getTime() > vencimiento.getTime()) {
        diffDays = diffDays * -1;
      }

      if (diffDays <= 30 && diffDays >= 1) {
        if (!this.aVencerse) {
          await this.documentosPorVencerse();
          this.aVencerse = true;
        }
      }

      if (diffDays <= 0) {
        if (!this.vencido) {
          await this.documentosVencidos();
          this.vencido = true;
        }
      }

    }
  }

  public async loadPage(): Promise<void> {
    this.documentos = await this.documentacionService.getDocumentos(this.imei).toPromise();

    await this.calcularVencido();
  }
}
