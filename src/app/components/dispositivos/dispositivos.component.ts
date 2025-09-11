import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SensorService } from '../../services/sensor.service';
import { SensorData } from '../../models/sensor.model';

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

  nuevoObj(): SensorData {
    return {
      id: Date.now(),
      name: '',
      value: 0,
      unit: '',
      status: 'normal',
      lastUpdate: new Date(),
      location: ''
    };
  }

  nuevoDispositivo() {
    this.formVisible = true;
    this.editando = false;
    this.dispositivoSeleccionado = this.nuevoObj();
  }

  editarDispositivo(dispositivo: SensorData) {
    this.formVisible = true;
    this.editando = true;
    this.dispositivoSeleccionado = { ...dispositivo };
  }

  guardarDispositivo() {
    if (this.editando) {
      this.sensorService.actualizar(this.dispositivoSeleccionado);
    } else {
      this.sensorService.agregar(this.dispositivoSeleccionado);
    }
    this.formVisible = false;
  }

  eliminarDispositivo(dispositivo: SensorData) {
    if (confirm(`¿Seguro que deseas eliminar el dispositivo ${dispositivo.name}?`)) {
      this.sensorService.eliminar(dispositivo.id);
    }
  }

  cancelar() {
    this.formVisible = false;
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
