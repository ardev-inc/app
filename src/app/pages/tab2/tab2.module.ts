import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { LicenciaComponent } from 'src/app/componentes/licencia/licencia.component';
import { VtvComponent } from 'src/app/componentes/vtv/vtv.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page, LicenciaComponent, VtvComponent],
  providers: [LicenciaComponent, VtvComponent]
})

export class Tab2PageModule {}
