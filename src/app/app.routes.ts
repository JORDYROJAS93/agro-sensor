import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { IrrigationComponent } from './components/irrigation/irrigation.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WeatherComponent } from './components/weather/weather.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Solo login en raíz
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent) },
      { path: 'alerts', loadComponent: () => import('./components/alerts/alerts.component').then(c => c.AlertsComponent) },
      { path: 'irrigation', loadComponent: () => import('./components/irrigation/irrigation.component').then(c => c.IrrigationComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(c => c.SettingsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent) },
      { path: 'weather', loadComponent: () => import('./components/weather/weather.component').then(c => c.WeatherComponent) },
      { path: 'dispositivos', loadComponent: () => import('./components/dispositivos/dispositivos.component').then(c => c.DispositivosComponent) },
      { path: 'monitor', loadComponent: () => import('./components/sensor-monitor/sensor-monitor.component').then(c => c.SensorMonitorComponent) },
      { path: 'cultivo', loadComponent: () => import('./components/cultivo/cultivo.component').then(c => c.CultivoComponent)}
    ]
  }
];