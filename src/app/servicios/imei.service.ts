import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImeiService implements OnInit{

  public imei: string;

  constructor() {
    this.imei = JSON.parse(localStorage.getItem('imei'));
   }

  public ngOnInit(): void { }

  public getImei(): string {
    return this.imei;
  }

  public setImei(imei: string): void {
    localStorage.setItem('imei', JSON.stringify(imei));
  }

 public borrarImei(): void{
   localStorage.removeItem('imei');
 }
 
}
