import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Definición de la interfaz del sector de riego
interface IrrigationSector {
  id: string;
  name: string;
  moisture: number; // Humedad actual (%)
  manualDuration: number; // Duración manual preestablecida (min)
  isRiegoActivo: boolean; // Indica si el riego está encendido
  lastIrrigationTime: Date | null; // Última vez que se regó
}

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './irrigation.component.html',
  styleUrls: ['./irrigation.component.css']
})
export class IrrigationComponent {
  // Configuración global (usa signals para estado reactivo)
  autoMode = signal(false);
  moistureThreshold = signal(30); // Umbral de humedad para modo automático

  // Lista de sectores, incluyendo su estado actual (usando signals para el array)
  sectors = signal<IrrigationSector[]>([
    { id: 'A', name: 'Sector A', moisture: 45, manualDuration: 10, isRiegoActivo: false, lastIrrigationTime: new Date(Date.now() - 3600000) },
    { id: 'B', name: 'Sector B ', moisture: 22, manualDuration: 15, isRiegoActivo: false, lastIrrigationTime: new Date(Date.now() - 7200000) },
    { id: 'C', name: 'Sector C ', moisture: 38, manualDuration: 5, isRiegoActivo: false, lastIrrigationTime: new Date(Date.now() - 18000000) },
    { id: 'INVERNADERO', name: 'Invernadero ', moisture: 55, manualDuration: 8, isRiegoActivo: false, lastIrrigationTime: null },
  ]);

  moistureThresholds = [10, 20, 30, 40, 50];
  
  // Mensaje de feedback para el usuario (reemplaza a alert)
  feedbackMessage = signal<{ type: 'success' | 'danger', text: string } | null>(null);

  // Computed que revisa si el modo automático debería disparar el riego en algún sector
  riegoAutomaticoPendiente = computed(() => {
    if (!this.autoMode()) return false;
    return this.sectors().some(sector => sector.moisture <= this.moistureThreshold() && !sector.isRiegoActivo);
  });

  // Método para activar el riego manual
  startManualIrrigation(sectorId: string) {
    this.sectors.update(sectors => sectors.map(sector => {
      if (sector.id === sectorId) {
        if (sector.manualDuration <= 0) {
          this.showFeedback('danger', `Por favor, ingresa una duración válida para ${sector.name}.`);
          return sector;
        }
        
        // Simulación de activación
        sector.isRiegoActivo = true;
        
        this.showFeedback('success', `Riego activado manualmente en ${sector.name} por ${sector.manualDuration} minutos.`);

        // Simular apagado automático después del tiempo (en un entorno real, sería una llamada a la API)
        setTimeout(() => {
          this.stopIrrigation(sectorId, sector.manualDuration);
        }, sector.manualDuration * 1000); // 1 segundo por minuto para la demo
      }
      return sector;
    }));
  }

  // Método para detener el riego
  stopIrrigation(sectorId: string, duration: number) {
    this.sectors.update(sectors => sectors.map(sector => {
      if (sector.id === sectorId && sector.isRiegoActivo) {
        sector.isRiegoActivo = false;
        sector.lastIrrigationTime = new Date();
        // Simular aumento de humedad después del riego (ejemplo)
        sector.moisture = Math.min(sector.moisture + duration * 2, 70); 
        this.showFeedback('success', `Riego finalizado en ${sector.name}. Duración: ${duration} minutos.`);
      }
      return sector;
    }));
  }
  
  // Método para mostrar feedback temporal
  showFeedback(type: 'success' | 'danger', text: string) {
    this.feedbackMessage.set({ type, text });
    setTimeout(() => this.feedbackMessage.set(null), 5000);
  }
  
  // Función helper para obtener el estilo del progreso
  getMoistureProgressClass(moisture: number): string {
    if (moisture <= this.moistureThreshold()) return 'bg-danger-subtle progress-bar-striped progress-bar-animated';
    if (moisture < this.moistureThreshold() + 15) return 'bg-warning';
    return 'bg-success';
  }
}