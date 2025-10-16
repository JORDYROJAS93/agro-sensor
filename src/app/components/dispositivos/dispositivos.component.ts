import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SensorService } from '../../services/sensor.service';
import { SensorData } from '../../models/sensor.model'; 
import { NgForm } from '@angular/forms'; // Añadido para tipado correcto si fuera necesario

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.css']
})
export class DispositivosComponent {
  dispositivos: SensorData[] = [];
  
  formVisible = false; 
  editando = false;
  dispositivoSeleccionado: SensorData = this.nuevoObj();

  constructor(private sensorService: SensorService) {
    this.dispositivos = this.sensorService.getSensores();
    this.sensorService.sensores$.subscribe(data => this.dispositivos = data);
  }

  // MODIFICACIÓN CLAVE 1: Dejar el ID como 0 o null. Se asignará al guardar.
  nuevoObj(): SensorData {
    return {
      id: 0, // ID temporal. El ID real se calculará al guardar.
      name: '',
      value: 0,
      unit: '',
      status: 'normal',
      lastUpdate: new Date(),
      location: ''
    };
  }

  nuevoDispositivo() {
    this.editando = false;
    this.dispositivoSeleccionado = this.nuevoObj();
  }

  editarDispositivo(dispositivo: SensorData) {
    this.editando = true;
    this.dispositivoSeleccionado = { ...dispositivo }; 
  }

  // MODIFICACIÓN CLAVE 2: Lógica para asignar el siguiente ID incremental
  guardarDispositivo() {
    this.dispositivoSeleccionado.lastUpdate = new Date(); // Actualizar la fecha
    
    if (this.editando) {
      this.sensorService.actualizar(this.dispositivoSeleccionado);
    } else {
      // Lógica para el ID incremental:
      let nextId = 1;
      if (this.dispositivos.length > 0) {
        // Encontrar el ID más grande y sumarle 1
        const maxId = Math.max(...this.dispositivos.map(d => d.id));
        nextId = maxId + 1;
      }
      
      this.dispositivoSeleccionado.id = nextId;
      this.sensorService.agregar(this.dispositivoSeleccionado);
    }
    
    this.editando = false;
  }

  eliminarDispositivo(dispositivo: SensorData) {
    if (confirm(`¿Seguro que deseas eliminar el dispositivo ${dispositivo.name}?`)) {
      this.sensorService.eliminar(dispositivo.id);
    }
  }

  cancelar() {
    this.editando = false;
    this.dispositivoSeleccionado = this.nuevoObj();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Advertencia';
      case 'danger': return 'Crítico';
      default: return 'Desconocido';
    }
  }
}