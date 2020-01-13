import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Vtv } from 'src/app/clases/Vtv.class';
import { DocumentacionService } from 'src/app/servicios/documentacion.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { ImeiService } from 'src/app/servicios/imei.service';

@Component({
  selector: 'app-vtv',
  templateUrl: './vtv.component.html',
  styleUrls: ['./vtv.component.scss'],
})
export class VtvComponent implements OnInit {

  @Input() public patente: string;
  @Input() public fechaVencimiento: Date;
  @Input() public id: string;

  @Output() public valueChange = new EventEmitter();


  public documentacion: Vtv;

  public imei: string;

  constructor(private servicio: DocumentacionService, private router: ActivatedRoute, private imeiService: ImeiService) {
    this.documentacion = new Vtv(this.patente, this.fechaVencimiento);
    this.id = this.documentacion.id;
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
          await this.servicio.borrarVTV(this.id, this.imei).toPromise();

          this.valueChange.emit();
        }
      })
  }

}
