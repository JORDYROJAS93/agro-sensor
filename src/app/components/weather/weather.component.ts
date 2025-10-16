 import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// Interfaz para tipado (opcional, pero buena práctica)
interface WeatherData {
  condition: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  icon: string;
}

interface ForecastDay {
  day: string;
  condition: string;
  high: number;
  low: number;
  icon: string;
  rainProb: number; // Nueva propiedad: Probabilidad de lluvia (%)
}

@Component({
  selector: 'app-weather',
  standalone: true,
  // Añadimos DatePipe para formateo de fechas
  imports: [CommonModule], 
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  // Información del día actual
  currentDayName: string = '';

  // Clima actual (tipado con la interfaz)
  currentWeather: WeatherData = {
    condition: 'Parcialmente Nublado',
    temp: 22,
    feelsLike: 23,
    humidity: 65,
    icon: 'cloud-sun'
  };

  // Recomendación basada en clima
  recommendation: string = '';

  // Plantillas de datos simulados para los días futuros (condiciones sin fecha)
  private readonly forecastTemplates: Omit<ForecastDay, 'day'>[] = [
    { condition: 'Lluvioso', high: 20, low: 15, icon: 'rain', rainProb: 80 },          // Día + 1 (Mañana)
    { condition: 'Parcialmente Nublado', high: 25, low: 18, icon: 'cloud-sun', rainProb: 10 }, // Día + 2
    { condition: 'Soleado', high: 28, low: 20, icon: 'sun', rainProb: 5 },            // Día + 3
    { condition: 'Tormenta Eléctrica', high: 24, low: 17, icon: 'thunderstorm', rainProb: 95 }  // Día + 4
  ];

  // Pronóstico por días (se llenará dinámicamente en ngOnInit)
  forecast: ForecastDay[] = [];

  ngOnInit(): void {
    // 1. Obtener el nombre del día actual (Día 0)
    this.currentDayName = this.getCurrentDayName(0);
    
    // 2. Generar la recomendación para hoy
    this.generateRecommendation();

    // 3. Generar el pronóstico para los días futuros (Día 1, 2, 3, 4)
    this.forecast = this.generateFutureForecast();
  }

  /**
   * Obtiene el nombre del día de la semana para N días a partir de hoy.
   * @param daysToAdd Número de días a sumar (0 = hoy, 1 = mañana).
   * @returns Nombre del día.
   */
  getCurrentDayName(daysToAdd: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    // Usa 'long' para el nombre completo del día y capitaliza la primera letra
    return date.toLocaleDateString('es-ES', { weekday: 'long' })
               .replace(/\b\w/g, l => l.toUpperCase()); 
  }

  /**
   * Genera el arreglo de pronóstico dinámico para los próximos días.
   */
  generateFutureForecast(): ForecastDay[] {
    const futureForecast: ForecastDay[] = [];
    
    for (let i = 1; i <= this.forecastTemplates.length; i++) {
        // Calcular el nombre del día (i=1 es mañana, i=2 es pasado mañana, etc.)
        const dayName = this.getCurrentDayName(i);
        const template = this.forecastTemplates[i - 1]; // Usar la plantilla de datos correspondiente

        futureForecast.push({
            day: dayName,
            condition: template.condition,
            high: template.high,
            low: template.low,
            icon: template.icon,
            rainProb: template.rainProb
        });
    }

    return futureForecast;
  }

  /**
   * Genera recomendaciones específicas para el cultivo.
   */
  generateRecommendation() {
    const temp = this.currentWeather.temp;
    const humidity = this.currentWeather.humidity;
    const condition = this.currentWeather.condition.toLowerCase();
    
    let advice = 'Monitoreo general. Condiciones óptimas para el crecimiento.';

    if (temp > 30) {
      advice = '🌡️ **ALERTA POR CALOR:** Considere aplicar **riego por la mañana** o al atardecer para evitar el estrés térmico en las plantas.';
    } else if (temp < 10) {
      advice = '❄️ **Riesgo de Heladas:** Proteja los cultivos más sensibles o cubra las plántulas jóvenes durante la noche.';
    }

    if (condition.includes('lluvia') || condition.includes('tormenta')) {
      advice = '🌧️ **No es necesario regar hoy.** Revise los sistemas de drenaje para evitar el encharcamiento y la proliferación de hongos.';
    } else if (condition.includes('soleado') && temp > 25) {
       advice = '☀️ **Máxima Evapotranspiración:** Asegure un riego profundo. Aplicar fertilizantes solubles por la tarde.';
    }
    
    if (humidity < 40) {
        advice += ' **Baja Humedad Ambiental:** Vigile la aparición de ácaros y ajuste el riego si es necesario.';
    }
    
    this.recommendation = advice;
  }

  /**
   * Devuelve una URL de icono según el tipo de clima.
   * Se usan iconos de Flaticon más variados y representativos.
   * @param icon Clave del icono (ej: 'sun', 'rain')
   * @returns URL de la imagen del icono.
   */
  getWeatherIcon(icon: string): string {
    const icons: Record<string, string> = {
      // Iconos corregidos y temáticos para clima
      sun: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',             // Soleado
      cloud: 'https://cdn-icons-png.flaticon.com/128/704/704845.png',           // Nublado
      'cloud-sun': 'https://cdn-icons-png.flaticon.com/128/12607/12607703.png',     // Parcialmente nublado
      rain: 'https://cdn-icons-png.flaticon.com/128/4724/4724094.png',            // Lluvia (Gotas con nube)
      thunderstorm: 'https://cdn-icons-png.flaticon.com/128/2864/2864448.png',      // Tormenta (Nube con rayo)
      default: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png'
    };
    return icons[icon] || icons['default']; 
  }
}
