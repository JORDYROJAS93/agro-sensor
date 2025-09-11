import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  status: string;
  lastUpdate: Date;
  location: string;
}

export interface Alerta {
  numero: number;
  sensor: string;
  min: number;
  max: number;
  fecha: string;
}


@Component({
  selector: 'app-configure-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {

  alertas: Alerta[] = [];

  sensors: SensorData[] = [
    { id: 1, name: 'Temperatura Suelo', value: 25.5, unit: '°C', status: 'normal', lastUpdate: new Date(), location: 'Sector A' },
    { id: 2, name: 'Humedad Suelo', value: 68.2, unit: '%', status: 'normal', lastUpdate: new Date(), location: 'Sector B' },
    { id: 3, name: 'pH', value: 6.8, unit: '', status: 'normal', lastUpdate: new Date(), location: 'Sector C' },
    { id: 4, name: 'Humedad Ambiente', value: 72.1, unit: '%', status: 'warning', lastUpdate: new Date(), location: 'Invernadero 1' },
    { id: 5, name: 'Luminosidad', value: 450, unit: 'lux', status: 'normal', lastUpdate: new Date(), location: 'Sector D' },
    { id: 6, name: 'Conductividad', value: 1.2, unit: 'mS/cm', status: 'normal', lastUpdate: new Date(), location: 'Sector E' }
  ];

  selectedSensorId: number | null = null;
  minValue: number | null = null;
  maxValue: number | null = null;
  notificationChannel: string = 'app';

  saveAlertConfig(): void {
  if (this.minValue === null || this.maxValue === null) {
    alert('⚠️ Debes ingresar ambos valores.');
    return;
  }

  if (this.minValue >= this.maxValue) {
    alert('⚠️ El valor mínimo debe ser menor que el máximo.');
    return;
  }

  const selectedSensor = this.sensors.find(sensor => sensor.id === Number(this.selectedSensorId));
  if (!selectedSensor) {
    alert('⚠️ Sensor no válido.');
    return;
  }

  // Mostrar confirmación
  alert(
    `✅ Alertas configuradas exitosamente\n\nSensor: ${selectedSensor.name}\nMínimo: ${this.minValue}${selectedSensor.unit}\nMáximo: ${this.maxValue}${selectedSensor.unit}\nNotificación: ${this.notificationChannel.toUpperCase()}`
  );

  // Agregar alerta a la tabla
  this.agregarAlerta(`${selectedSensor.name} - ${selectedSensor.location}`, this.minValue, this.maxValue);

  // Limpiar formulario
  this.selectedSensorId = null;
  this.minValue = null;
  this.maxValue = null;
  this.notificationChannel = 'app';
}


agregarAlerta(sensor: string, min: number, max: number): void {
  const tabla = document.getElementById('tablaAlertas')?.getElementsByTagName('tbody')[0];
  if (!tabla) return;

  const nuevaFila = tabla.insertRow();
  const numAlerta = tabla.rows.length;

  const celda0 = nuevaFila.insertCell(0);
  const celda1 = nuevaFila.insertCell(1);
  const celda2 = nuevaFila.insertCell(2);
  const celda3 = nuevaFila.insertCell(3);
  const celda4 = nuevaFila.insertCell(4);

  celda0.innerText = numAlerta.toString();
  celda1.innerText = sensor;
  celda2.innerText = min.toString();
  celda3.innerText = max.toString();
  celda4.innerText = new Date().toLocaleString(); // Fecha y hora actual
}



  
}
