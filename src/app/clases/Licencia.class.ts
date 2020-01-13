export class Licencia {
    apellido: string;
    id: string;
    nombre: string;
    numeroLicencia: string;
    tipo: string;
    vencimiento: Date;

    constructor(nombre: string, apellido: string, numeroLicencia: string, fechaVenc: Date) {
        this.tipo = 'Licencia';
        this.nombre = nombre;
        this.apellido = apellido;
        this.numeroLicencia = numeroLicencia;
        this.vencimiento = fechaVenc;
    };   
}