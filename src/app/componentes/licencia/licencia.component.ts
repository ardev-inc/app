import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Licencia } from 'src/app/clases/Licencia.class';
import { DocumentacionService } from 'src/app/servicios/documentacion.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'
import { ImeiService } from 'src/app/servicios/imei.service';

@Component({
  selector: 'app-licencia',
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.scss'],
})


export class LicenciaComponent implements OnInit {

  @Input() public nombre: string;
  @Input() public apellido: string;
  @Input() public numeroLicencia: string;
  @Input() public fechaVencimiento: Date;
  @Input() public id: string;

  @Output() public valueChange = new EventEmitter();

  public documentacion: Licencia;

  public imei: string;

  constructor(private servicio: DocumentacionService, private router: Router, private imeiService: ImeiService) {
    this.documentacion = new Licencia(this.nombre, this.apellido, this.numeroLicencia, this.fechaVencimiento);
  }

  public ngOnInit(): void { 
    this.imei = this.imeiService.getImei();
  }

  public async borrar(): Promise<void> {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto no puede revertirse",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si!',
      cancelButtonText: 'Me arrepenti'
    }).then(async (result) => {
      if (result.value) {
        Swal.fire(
          '¡Eliminado!',
          'success'
        )
        await this.servicio.borrarLicencia(this.id, this.imei).toPromise();

        this.valueChange.emit();
      }
    })

  }

}
