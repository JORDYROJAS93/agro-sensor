import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  farmerType: string;
  acceptTerms: boolean;
}


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: User = {

    fullName: '',
    email: '',
    phone: '',
    password: '',
    farmerType: '',
    acceptTerms: false
  };

  constructor(private router: Router) { }

  onRegister(): void {
    if (!this.user.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    if (!this.user.fullName || !this.user.phone || !this.user.email)  {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }


    const mensaje = `✅ Usuario registrado exitosamente\n
👤 Nombre completo: ${this.user.fullName}
📞 Teléfono: ${this.user.phone}
📧 Correo: ${this.user.email}`;

    alert(mensaje);

    // Redirigir al login
    this.router.navigate(['/']);
  }
}