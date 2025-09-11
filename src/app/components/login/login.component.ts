import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink], // Puedes añadir módulos si usas directivas como ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;


  constructor(private router: Router, private authService: AuthService) {}
   // Lista de usuarios válidos
  users = [
    { email: 'jordy@gmail.com', password: 'admin' },
    { email: 'admin', password: 'admin' },
    { email: 'user', password: 'user123' }
  ];


   onLogin() {
    if (this.authService.login(this.email, this.password)) {
      console.log('Iniciando sesión...', {
        username: this.email,
        rememberMe: this.rememberMe
      });
      this.router.navigate(['/app/profile']); // 👈 Redirige al perfil
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}