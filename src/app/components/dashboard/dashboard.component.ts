import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import Chart, { RadialLinearScale } from 'chart.js/auto';

// Importación para XLSX
import * as XLSX from 'xlsx';

// Asegúrate de que Chart.js esté registrado si usas tipos específicos
Chart.register(RadialLinearScale);

// Interfaz para definir la estructura de los datos históricos
interface HistoricalRecord {
  timestamp: string;
  cultivo: string;
  humedadSuelo: number;
  temperaturaAmb: number;
  luzSolar: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Se incluye CommonModule para usar *ngFor y *ngIf en el HTML
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  // Se recomienda 'styleUrl' para standalone components en lugar de 'styleUrls'
  styleUrl: './dashboard.component.css' 
})
export class DashboardComponent implements AfterViewInit {

  // Simulación del dataset histórico para la exportación a Excel
  historicalData: HistoricalRecord[] = [
    { timestamp: '2025-10-14 10:00:00', cultivo: 'Maíz', humedadSuelo: 45, temperaturaAmb: 22, luzSolar: 750 },
    { timestamp: '2025-10-14 12:00:00', cultivo: 'Maíz', humedadSuelo: 42, temperaturaAmb: 25, luzSolar: 900 },
    { timestamp: '2025-10-14 14:00:00', cultivo: 'Maíz', humedadSuelo: 40, temperaturaAmb: 28, luzSolar: 850 },
    { timestamp: '2025-10-15 10:00:00', cultivo: 'Maíz', humedadSuelo: 48, temperaturaAmb: 20, luzSolar: 600 },
    { timestamp: '2025-10-15 12:00:00', cultivo: 'Maíz', humedadSuelo: 45, temperaturaAmb: 23, luzSolar: 780 },
    { timestamp: '2025-10-15 14:00:00', cultivo: 'Maíz', humedadSuelo: 44, temperaturaAmb: 24, luzSolar: 810 },
    { timestamp: '2025-10-16 10:00:00', cultivo: 'Maíz', humedadSuelo: 41, temperaturaAmb: 21, luzSolar: 700 },
  ];

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  /**
   * Exporta los datos históricos simulados a un archivo Excel (XLSX).
   */
  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.historicalData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HistorialSensores');

    const excelFileName = `Historial_AgroSensor_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, excelFileName);

    alert(`¡Exportación exitosa! Archivo ${excelFileName} generado.`);
  }

  // Mantiene tu código de renderizado de gráficos
  renderCharts(): void {
    // Gráfico de Humedad
    const ctxHumidity = document.getElementById('humidityChart') as HTMLCanvasElement;
    new Chart(ctxHumidity, {
      type: 'bar',
      data: {
        labels: ['Humedad del Suelo'],
        datasets: [{
          label: 'Porcentaje (%)',
          data: [45],
          backgroundColor: '#4caf50',
          barPercentage: 0.6,
          categoryPercentage: 0.5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: { stepSize: 25 }
          },
          y: {
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: () => `Humedad: 45%`
            }
          }
        }
      }
    });

    // Gráfico de Temperatura
    const ctxTemp = document.getElementById('temperatureChart') as HTMLCanvasElement;
    new Chart(ctxTemp, {
      type: 'bar',
      data: {
        labels: ['Min', 'Actual', 'Max'],
        datasets: [{
          label: 'Temperatura (°C)',
          data: [18, 22, 26],
          backgroundColor: '#2196f3'
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: { ticks: { color: '#555' } },
          y: { ticks: { color: '#555' } }
        }
      }
    });

    // Gráfico de Luz Solar
    const ctxLight = document.getElementById('lightChart') as HTMLCanvasElement;
    new Chart(ctxLight, {
      type: 'doughnut',
      data: {
        labels: ['Luz Disponible', 'Espacio Vacío'],
        datasets: [{
          data: [75, 25],
          backgroundColor: ['#ffeb3b', '#e0e0e0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true
          }
        }
      }
    });

    // Gráfico de Resumen Semanal
    const ctxWeekly = document.getElementById('weeklySummaryChart') as HTMLCanvasElement;
    new Chart(ctxWeekly, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Humedad (%)',
            data: [40, 42, 45, 43, 41, 40, 39],
            borderColor: '#4caf50',
            fill: false
          },
          {
            label: 'Temperatura (°C)',
            data: [20, 21, 22, 23, 24, 22, 21],
            borderColor: '#2196f3',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#555' } }
        },
        scales: {
          x: { ticks: { color: '#555' } },
          y: { ticks: { color: '#555' } }
        }
      }
    });
  }
}