import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// 1. Importar HttpClient y el módulo necesario
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { SensorData } from '../../models/sensor.model';
import { SensorService } from '../../services/sensor.service';
import * as XLSX from 'xlsx';

// Interfaz para el registro histórico
interface LecturaHistorica {
  fecha: string; 
  tipoSensor: string;
  ubicacion: string;
  valor: number;
  unidad: string;
}

@Component({
  selector: 'app-cultivo',
  standalone: true,
  // 🔴 CAMBIO CLAVE: Importamos HttpClientModule para asegurar que el proveedor esté disponible
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './cultivo.component.html',
  styleUrls: ['./cultivo.component.css']
})
export class CultivoComponent implements OnInit {
  sensores: SensorData[] = [];
  sensorSeleccionado: SensorData | null = null;
  tipoSensorSeleccionado: string | null = null;
  
  // PROPIEDADES DE FILTRO
  filtroSector: string = 'Todos'; 
  fechaInicio: string = '';       
  fechaFin: string = '';          

  lecturasHistoricas: LecturaHistorica[] = []; 
  
  private historialDataUrl = 'assets/datos/historial-sensores.json'; 

  // INYECCIÓN DEL SERVICIO HTTP
  constructor(private sensorService: SensorService, private http: HttpClient) { } 

  ngOnInit(): void {
    // Cargar la data de los sensores base
    this.sensorService.sensores$.subscribe(data => {
      this.sensores = data;
    });
    this.sensores = this.sensorService.getSensores();
    
    // Cargar la data del historial
    this.cargarHistorial();
  }

  // MÉTODO: Carga los datos del archivo JSON usando HttpClient
  cargarHistorial(): void {
      this.http.get<LecturaHistorica[]>(this.historialDataUrl)
          .subscribe({
              next: (data) => {
                  this.lecturasHistoricas = data;
              },
              error: (err) => {
                  console.error('Error al cargar el historial:', err);
                  // En caso de error, muestra un mensaje
                  alert('No se pudo cargar el historial de datos. Revisa la consola y el archivo JSON.');
              }
          });
  }

  // GETTER: Opciones disponibles para el filtro de sector
  get sectoresDisponibles(): string[] {
      return ['Todos', 'Sector A', 'Sector B', 'Sector C', 'Invernadero', 'Exterior'];
  }

  // GETTER: Aplica todos los filtros a la data del historial
  get lecturasFiltradas(): LecturaHistorica[] {
      let data = this.lecturasHistoricas;

      if (this.filtroSector !== 'Todos') {
          data = data.filter(lectura => lectura.ubicacion === this.filtroSector);
      }

      const start = this.fechaInicio ? new Date(this.fechaInicio) : null;
      const end = this.fechaFin ? new Date(this.fechaFin) : null;

      if (start || end) {
          data = data.filter(lectura => {
              // Solo compara la parte de la fecha (YYYY-MM-DD)
              const registroDateString = lectura.fecha.split(' ')[0];
              const fechaRegistro = new Date(registroDateString);
              
              let cumpleRango = true;

              if (start && fechaRegistro < start) {
                  cumpleRango = false;
              }

              if (end && fechaRegistro > end) {
                  cumpleRango = false;
              }
              
              return cumpleRango;
          });
      }

      return data;
  }

  // MÉTODO: Exporta solo la data filtrada
  exportToExcel(): void {
    const dataToExport = this.lecturasFiltradas;
    
    if (dataToExport.length === 0) {
      alert("No hay datos que coincidan con los filtros para exportar.");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HistorialFiltrado');

    const sectorNombre = this.filtroSector !== 'Todos' ? `_${this.filtroSector}` : '';
    const excelFileName = `Historial_Cultivo${sectorNombre}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, excelFileName);

    alert(`¡Exportación exitosa! Se exportaron ${dataToExport.length} registros.`);
  }
  
  // (El resto de métodos inferirTipo, onSelectSensor, etc. se mantienen igual)
  private inferirTipo(nombre: string): string {
    nombre = nombre.toLowerCase();
    if (nombre.includes('temperatura')) return 'temperature';
    if (nombre.includes('humedad')) return 'humidity';
    if (nombre.includes('ph')) return 'ph';
    if (nombre.includes('luz') || nombre.includes('luminosidad')) return 'light';
    if (nombre.includes('presión')) return 'pressure';
    return 'unknown';
  }

  onSelectSensor(event: Event) {
    const select = event.target as HTMLSelectElement;
    const sensorId = Number(select.value);
    const sensor: SensorData | null = this.sensores.find(s => s.id === sensorId) || null;

    if (sensor) {
      this.sensorSeleccionado = sensor;
      this.tipoSensorSeleccionado = this.inferirTipo(sensor.name);
    }
  }

  onSelectSector(location: string) {
    if (!this.tipoSensorSeleccionado) return;
    let sensorEnZona = this.sensores.find(s =>
      s.location === location && this.inferirTipo(s.name) === this.tipoSensorSeleccionado
    ) ?? null;

    if (!sensorEnZona) {
      const baseSensor = this.sensores.find(s => this.inferirTipo(s.name) === this.tipoSensorSeleccionado) ?? null;

      if (baseSensor) {
        const variation = this.getVariation(location, this.tipoSensorSeleccionado);
        const newValue = this.aplicarRango(
          baseSensor.value + variation,
          this.tipoSensorSeleccionado
        );

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
    this.sensorSeleccionado = sensorEnZona;
  }

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
    const nombreBase = sensor.name
      .replace(/\s*\(?(Sector [A-C]|Invernadero|Exterior)\)?/g, '')
      .trim();
    return `${nombreBase} (${sensor.location})`;
  }
}