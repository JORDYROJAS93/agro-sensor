export interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: Date;
  location: string;
}
