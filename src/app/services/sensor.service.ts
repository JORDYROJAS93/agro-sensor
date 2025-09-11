import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SensorData } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private sensores: SensorData[] = [
    { id: 1, name: 'Temperatura Suelo', value: 25, unit: '°C', status: 'normal', lastUpdate: new Date(), location: 'Sector A' },
    { id: 2, name: 'Humedad Suelo', value: 65, unit: '%', status: 'normal', lastUpdate: new Date(), location: 'Sector B' },
    { id: 3, name: 'PH', value: 6.5, unit: 'pH', status: 'warning', lastUpdate: new Date(), location: 'Sector C' },
    { id: 3, name: 'Temperatura Ambiente', value: 22, unit: '°C', status: 'warning', lastUpdate: new Date(), location: 'Invernadero' },
    { id: 4, name: 'Humedad Ambiente', value: 70, unit: '%', status: 'normal', lastUpdate: new Date(), location: 'Invernadero' },
    { id: 5, name: 'Nivel de Luz', value: 300, unit: 'lux', status: 'danger', lastUpdate: new Date(), location: 'Invernadero' },
    { id: 6, name: 'Presión Atmosférica', value: 1013, unit: 'hPa', status: 'normal', lastUpdate: new Date(), location: 'Exterior' }
  ];

  private sensoresSubject = new BehaviorSubject<SensorData[]>(this.sensores);
  sensores$ = this.sensoresSubject.asObservable();

  getSensores(): SensorData[] {
    return [...this.sensores]; // devuelve copia
  }

  agregar(sensor: SensorData) {
    this.sensores.push(sensor);
    this.sensoresSubject.next([...this.sensores]);
  }

  actualizar(sensor: SensorData) {
    const index = this.sensores.findIndex(s => s.id === sensor.id);
    if (index > -1) {
      this.sensores[index] = sensor;
      this.sensoresSubject.next([...this.sensores]);
    }
  }

  eliminar(id: number) {
    this.sensores = this.sensores.filter(s => s.id !== id);
    this.sensoresSubject.next([...this.sensores]);
  }
}

