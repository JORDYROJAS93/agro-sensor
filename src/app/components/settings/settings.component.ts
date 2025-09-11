import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule,FormsModule], // Puedes añadir módulos si usas directivas como ngModel
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settings = {
    cropType: '',
    location: '',

    sensors: [
      { id: 1, name: 'Humedad del Suelo', active: true },
      { id: 2, name: 'Temperatura Ambiental', active: true },
      { id: 3, name: 'Luz Solar', active: false },
      { id: 4, name: 'Nivel de Agua', active: true }
    ],

    notifications: [
      { type: 'email', label: 'Correo Electrónico', enabled: true },
      { type: 'sms', label: 'SMS', enabled: false },
      { type: 'push', label: 'Notificación Push', enabled: true }
    ],

    weatherApiConnected: true,
    pushNotifications: true
  };

  saveCropSettings() {
    alert('Datos del cultivo guardados');
    console.log('Configuración actualizada:', this.settings);
  }

  checkSensorStatus() {
    alert('Verificando estado de sensores...');
    // Simular comprobación
    this.settings.sensors.forEach(sensor => {
      if (Math.random() > 0.5) sensor.active = true;
    });
  }
}
