import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms'; // Importar NgForm

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
  id: number; // Identificador único de la alerta
  sensor: string; // Nombre y ubicación del sensor
  min: number;
  max: number;
  fecha: string;
  notificationChannel: string; // Nuevo: Para saber cómo notificar
}


@Component({
  selector: 'app-configure-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {

  // Alertas de ejemplo iniciales
  alertas: Alerta[] = [
    { id: 1, sensor: 'Temperatura Suelo - Sector A', min: 18, max: 30, fecha: new Date().toLocaleString(), notificationChannel: 'app' },
    { id: 2, sensor: 'Humedad Ambiente - Invernadero 1', min: 60, max: 80, fecha: new Date().toLocaleString(), notificationChannel: 'email' },
  ];
  
  // Variables para la edición (mantendrá la alerta seleccionada para el formulario)
  editingAlert: Alerta | null = null; 

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

  saveAlertConfig(form: NgForm): void {
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

    const sensorNameLocation = `${selectedSensor.name} - ${selectedSensor.location}`;

    if (this.editingAlert) {
      // Lógica para **EDITAR** una alerta existente
      const index = this.alertas.findIndex(a => a.id === this.editingAlert!.id);
      if (index !== -1) {
        this.alertas[index] = {
          ...this.alertas[index],
          sensor: sensorNameLocation,
          min: this.minValue,
          max: this.maxValue,
          notificationChannel: this.notificationChannel,
          fecha: new Date().toLocaleString() // Actualizar fecha de modificación
        };
        alert(`✏️ Alerta #${this.editingAlert.id} actualizada exitosamente.`);
      }
      this.editingAlert = null; // Finalizar modo edición
    } else {
      // Lógica para **AGREGAR** una nueva alerta
      const nuevaAlerta: Alerta = {
        id: this.alertas.length > 0 ? Math.max(...this.alertas.map(a => a.id)) + 1 : 1, // Generar ID único
        sensor: sensorNameLocation,
        min: this.minValue,
        max: this.maxValue,
        fecha: new Date().toLocaleString(),
        notificationChannel: this.notificationChannel
      };
      this.alertas.push(nuevaAlerta);
      alert('✅ Alerta configurada y agregada exitosamente.');
    }


    // Limpiar formulario y reiniciar variables
    this.selectedSensorId = null;
    this.minValue = null;
    this.maxValue = null;
    this.notificationChannel = 'app';
    form.resetForm({ notificationChannel: 'app' }); // Asegura que el canal se reinicie
  }

  
  /**
   * Carga los datos de la alerta seleccionada en el formulario para su edición.
   * @param alerta La alerta a editar.
   */
  editarAlerta(alerta: Alerta): void {
    this.editingAlert = alerta; // Establece la alerta en modo edición

    // Encontrar el ID del sensor basado en el nombre de la alerta
    const sensorInfo = alerta.sensor.split(' - '); // Separa el nombre y la ubicación
    const sensorName = sensorInfo[0]; 

    const selectedSensor = this.sensors.find(s => s.name === sensorName);
    
    if (selectedSensor) {
      this.selectedSensorId = selectedSensor.id;
    } else {
      // Si el sensor no se encuentra, seleccionar el primero o dejarlo en null
      this.selectedSensorId = this.sensors[0].id;
    }
    
    // Cargar los demás campos
    this.minValue = alerta.min;
    this.maxValue = alerta.max;
    this.notificationChannel = alerta.notificationChannel;

    // Puedes agregar una pequeña notificación o scroll para indicar que el formulario ha sido cargado
    console.log(`Cargando alerta #${alerta.id} para edición.`);
  }

  /**
   * Elimina la alerta seleccionada del array.
   * @param id El ID de la alerta a eliminar.
   */
  eliminarAlerta(id: number): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la alerta #${id}?`)) {
      this.alertas = this.alertas.filter(alerta => alerta.id !== id);
      alert(`🗑️ Alerta #${id} eliminada.`);
    }
  }

  /**
   * Obtiene el nombre completo del canal de notificación.
   * @param channel El valor ('app', 'email', 'sms').
   * @returns El texto de visualización.
   */
  getNotificationChannelName(channel: string): string {
    switch (channel) {
      case 'app':
        return 'App';
      case 'email':
        return 'Correo';
      case 'sms':
        return 'SMS';
      default:
        return 'Desconocido';
    }
  }
}
