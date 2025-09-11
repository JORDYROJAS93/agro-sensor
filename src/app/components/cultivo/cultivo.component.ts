import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SensorData } from '../../models/sensor.model';
import { SensorService } from '../../services/sensor.service';

@Component({
  selector: 'app-cultivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cultivo.component.html',
  styleUrls: ['./cultivo.component.css']
})
export class CultivoComponent implements OnInit {
  sensores: SensorData[] = [];
  sensorSeleccionado: SensorData | null = null;
  tipoSensorSeleccionado: string | null = null; // tipo inferido del sensor seleccionado

  constructor(private sensorService: SensorService) { }

  ngOnInit(): void {
    this.sensorService.sensores$.subscribe(data => {
      this.sensores = data;
    });

    this.sensores = this.sensorService.getSensores();
  }

  // 🔹 Inferir el tipo de sensor basado en el nombre
  private inferirTipo(nombre: string): string {
    nombre = nombre.toLowerCase();
    if (nombre.includes('temperatura')) return 'temperature';
    if (nombre.includes('humedad')) return 'humidity';
    if (nombre.includes('ph')) return 'ph';
    if (nombre.includes('luz') || nombre.includes('luminosidad')) return 'light';
    if (nombre.includes('presión')) return 'pressure';
    return 'unknown';
  }

  // 🔹 Cuando se selecciona un sensor del combo
  onSelectSensor(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sensorId = Number(select.value);
    const sensor: SensorData | null = this.sensores.find(s => s.id === sensorId) || null;

    if (sensor) {
      this.sensorSeleccionado = sensor;
      this.tipoSensorSeleccionado = this.inferirTipo(sensor.name); // inferimos el tipo
    }
  }

  // 🔹 Cuando se hace clic en un sector
  onSelectSector(location: string) {
    if (!this.tipoSensorSeleccionado) return;

    // Busca un sensor del mismo tipo en esa ubicación
    let sensorEnZona = this.sensores.find(s =>
      s.location === location && this.inferirTipo(s.name) === this.tipoSensorSeleccionado
    ) ?? null;  // ← AQUÍ: convierte undefined a null

    // Si no existe, lo simulamos
    if (!sensorEnZona) {
      const baseSensor = this.sensores.find(s => this.inferirTipo(s.name) === this.tipoSensorSeleccionado) ?? null;

      if (baseSensor) {
        const variation = this.getVariation(location, this.tipoSensorSeleccionado);
        const newValue = this.aplicarRango(
          baseSensor.value + variation,
          this.tipoSensorSeleccionado
        );

        // Creamos un sensor simulado
        sensorEnZona = {
          ...baseSensor,
          value: newValue,
          location: location,
          name: `${baseSensor.name} (${location})`,
          id: -1,
          lastUpdate: new Date()
        };
      }
    }

    // Ahora seguro: sensorEnZona es SensorData | null
    this.sensorSeleccionado = sensorEnZona;
  }

  // 🔹 Variación por sector y tipo
  private getVariation(location: string, type: string): number {
    const variaciones: Record<string, Record<string, number>> = {
      temperature: { 'Sector A': 1, 'Sector B': -1, 'Sector C': 0.5, 'Invernadero': 3, 'Exterior': -2 },
      humidity: { 'Sector A': -5, 'Sector B': 5, 'Sector C': 0, 'Invernadero': 10, 'Exterior': -3 },
      ph: { 'Sector A': 0.2, 'Sector B': -0.1, 'Sector C': 0.3, 'Invernadero': 0.5, 'Exterior': 0 },
      light: { 'Sector A': 50, 'Sector B': -20, 'Sector C': 30, 'Invernadero': 100, 'Exterior': 500 },
      pressure: { 'Sector A': -5, 'Sector B': 2, 'Sector C': 0, 'Invernadero': 3, 'Exterior': 0 }
    };
    return variaciones[type]?.[location] || 0;
  }

  // 🔹 Asegura valores dentro de rangos razonables
  private aplicarRango(value: number, type: string): number {
    switch (type) {
      case 'ph':
        return +Math.max(0, Math.min(14, value)).toFixed(2);
      case 'temperature':
        return +Math.max(-50, Math.min(100, value)).toFixed(1);
      case 'humidity':
        return +Math.max(0, Math.min(100, value)).toFixed(1);
      case 'light':
        return +Math.max(0, value).toFixed(0);
      case 'pressure':
        return +Math.max(800, Math.min(1200, value)).toFixed(0);
      default:
        return +value.toFixed(2);
    }
  }


  getNombreConUbicacion(sensor: SensorData): string {
    // Extraemos el tipo base del nombre (sin la parte de ubicación)
    const nombreBase = sensor.name
      .replace(/\s*\(?(Sector [A-C]|Invernadero|Exterior)\)?/g, '')
      .trim();

    return `${nombreBase} (${sensor.location})`;
  }


}