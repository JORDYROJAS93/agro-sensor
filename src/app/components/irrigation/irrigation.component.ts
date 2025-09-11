import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule, FormsModule], // Puedes añadir módulos como CommonModule si usas directivas
  templateUrl: './irrigation.component.html',
  styleUrls: ['./irrigation.component.css']
})
export class IrrigationComponent {
  // Valores iniciales
  manualDuration = 10;
  autoMode = false;
  currentMoisture = 35;
  moistureThreshold = 30;

  moistureThresholds = [10, 20, 30, 40, 50];

  startManualIrrigation() {
    if (this.manualDuration > 0) {
      alert(`Riego activado por ${this.manualDuration} minutos`);
      // Aquí puedes llamar a un servicio o API para encender el riego
    } else {
      alert('Por favor ingresa una duración válida');
    }
  }
}