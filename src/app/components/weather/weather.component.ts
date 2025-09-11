import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule], // Puedes añadir módulos si usas directivas como ngIf o ngFor
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  // Clima actual
  currentWeather = {
    condition: 'Nublado',
    temp: 22,
    feelsLike: 23,
    humidity: 65,
    icon: 'cloud'
  };

  // Recomendación basada en clima
  recommendation = 'Hoy es un buen día para regar, no hay probabilidad de lluvia.';

  // Pronóstico por días
  forecast = [
    {
      day: 'Hoy',
      condition: 'Lluvioso',
      high: 20,
      low: 15,
      icon: 'rain'
    },
    {
      day: 'Mañana',
      condition: 'Parcialmente nublado',
      high: 25,
      low: 18,
      icon: 'cloud-sun'
    },
    {
      day: 'Jue',
      condition: 'Soleado',
      high: 28,
      low: 20,
      icon: 'sun'
    },
    {
      day: 'Vie',
      condition: 'Tormenta',
      high: 24,
      low: 17,
      icon: 'thunderstorm'
    }
  ];

  // Devuelve una URL de icono según el tipo
  getWeatherIcon(icon: string): string {
    const icons: Record<string, string> = {
      sun: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', 
      cloud: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', 
      'cloud-sun': 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', 
      rain: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', 
      thunderstorm: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' 
    };
    return icons[icon] || 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png'; 
  }
}