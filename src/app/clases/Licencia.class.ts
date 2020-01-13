export class Licencia {

    id: string;
    tipo: string;
    nombre: string;
    apellido: string;
    numeroLicencia: string;
    vencimiento: Date;

    constructor(nombre: string, apellido: string, numeroLicencia: string, fechaVenc: Date) {
        this.tipo = 'Licencia';
        this.nombre = nombre;
        this.apellido = apellido;
        this.numeroLicencia = numeroLicencia;
        this.vencimiento = fechaVenc;
    };   

}