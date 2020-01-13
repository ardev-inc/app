export class Vtv {
    id: string;
    patente: string;
    tipo: string;
    vencimiento: Date;

    constructor(patente: string, fechaVencimiento: Date) {
        this.tipo = 'VTV';
        this.patente = patente;
        this.vencimiento = fechaVencimiento;
    };
}