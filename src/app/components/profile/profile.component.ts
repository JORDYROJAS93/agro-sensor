import { AuthService } from './../../auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Puedes añadir módulos si usas directivas como ngModel
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  defaultPhoto = 'https://via.placeholder.com/100x100?text=Perfil';

  user: any = {
    name: '',
    email: '',
    role: '',
    photoUrl: ''
  };


  constructor(private router: Router, private authService: AuthService) {}


 ngOnInit(): void {
  if (this.authService.isLoggedIn()) {
    this.user = this.authService.getUser();
  } else {
    this.router.navigate(['/']); // 👈 ahora sí se usa router
  }
}


  saveProfile() {
    localStorage.setItem('user', JSON.stringify(this.user));
    alert('Perfil guardado exitosamente');
    console.log('Datos actualizados:', this.user);
  }

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}