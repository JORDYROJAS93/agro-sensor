import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import { RadialLinearScale } from 'chart.js';



Chart.register(RadialLinearScale);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  renderCharts(): void {
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