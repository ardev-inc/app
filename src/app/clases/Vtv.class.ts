export class Vtv {

    id: string;
    tipo: string;
    patente: string;
    vencimiento: Date;

    constructor(patente: string, fechaVencimiento: Date) {
        this.tipo = 'VTV';
        this.patente = patente;
        this.vencimiento = fechaVencimiento;
    };

}