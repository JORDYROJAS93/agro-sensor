import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { SensorService } from '../../services/sensor.service';

interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: Date;
  location: string;
}

@Component({
  selector: 'app-sensor-monitor',
  standalone: true,
  imports: [NgClass,CommonModule],
  providers: [DatePipe],
  templateUrl: './sensor-monitor.component.html',
  styleUrl: './sensor-monitor.component.css'
})
export class SensorMonitorComponent implements OnInit, OnDestroy {
  
  sensors: SensorData[] = [];

  constructor(private sensorService: SensorService) {
      this.sensors = this.sensorService.getSensores();
      this.sensorService.sensores$.subscribe(data => this.sensors = data);
    }

  private updateSubscription!: Subscription;
  lastRefresh: Date = new Date();

  ngOnInit(): void {
    // Simular actualización en tiempo real cada 3 segundos
    this.updateSubscription = interval(3000).subscribe(() => {
      this.updateSensorData();
    });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  updateSensorData(): void {
    // Simular datos en tiempo real con valores aleatorios
    this.sensors = this.sensors.map(sensor => {
      const variation = (Math.random() - 0.5) * 2; // Variación de -1 a +1
      const newValue = Math.max(0, sensor.value + variation);
      
      // Determinar estado basado en valores
      let status: 'normal' | 'warning' | 'danger' = 'normal';
      
      // Lógica de estado según tipo de sensor
      switch(sensor.name) {
        case 'Temperatura Suelo':
          if (newValue > 35) status = 'danger';
          else if (newValue > 30) status = 'warning';
          break;
        case 'Humedad Suelo':
          if (newValue < 30) status = 'danger';
          else if (newValue < 40) status = 'warning';
          break;
        case 'Humedad Ambiente':
          if (newValue > 80 || newValue < 40) status = 'danger';
          else if (newValue > 70 || newValue < 50) status = 'warning';
          break;
      }

      return {
        ...sensor,
        value: Math.round(newValue * 10) / 10, // Redondear a 1 decimal
        status,
        lastUpdate: new Date()
      };
    });

    this.lastRefresh = new Date();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'normal': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Advertencia';
      case 'danger': return 'Crítico';
      default: return 'Desconocido';
    }
  }

  refreshData(): void {
    this.updateSensorData();
  }

  getSensorIcon(sensorName: string): string {
    if (sensorName.includes('Temperatura')) return '🌡️';
    if (sensorName.includes('Humedad')) return '💧';
    if (sensorName.includes('pH')) return '🧪';
    if (sensorName.includes('Luminosidad')) return '☀️';
    if (sensorName.includes('Conductividad')) return '⚡';
    return '📊';
  }

  getProgressPercentage(sensor: SensorData): number {
    // Lógica para calcular porcentaje según tipo de sensor
    switch(sensor.name) {
      case 'Temperatura Suelo':
        return Math.min(100, Math.max(0, (sensor.value / 50) * 100));
      case 'Humedad Suelo':
      case 'Humedad Ambiente':
        return sensor.value;
      case 'pH':
        return (sensor.value / 14) * 100;
      case 'Luminosidad':
        return Math.min(100, (sensor.value / 1000) * 100);
      case 'Conductividad':
        return Math.min(100, (sensor.value / 5) * 100);
      default:
        return 50;
    }
  }

  getMaxValue(sensor: SensorData): number | string {
    switch(sensor.name) {
      case 'Temperatura Suelo': return '50°C';
      case 'Humedad Suelo':
      case 'Humedad Ambiente': return '100%';
      case 'pH': return '14';
      case 'Luminosidad': return '1000 lux';
      case 'Conductividad': return '5 mS/cm';
      default: return '100';
    }

  }
}
