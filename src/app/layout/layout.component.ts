import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // 👈 Importa Router
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(private router: Router) {} // 👈 Inyecta Router

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')){
      console.log('Cerrando sesión...');
    this.router.navigate(['/']);
    }
    
  }
}