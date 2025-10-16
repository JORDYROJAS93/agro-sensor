import { AuthService } from './../../auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Definimos una interfaz clara para la estructura del objeto usuario
interface UserProfile {
  name: string;
  email: string;
  role: string;
  photoUrl: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Estado para la foto de perfil por defecto
  defaultPhoto = 'https://placehold.co/100x100/10B981/ffffff?text=U'; 

  // 2. Usamos la interfaz para tipar el signal
  user = signal<UserProfile>({
    name: '',
    email: '',
    role: '',
    photoUrl: ''
  });

  // Variables de control de UI
  feedbackMessage = signal<{ type: 'success' | 'danger', text: string } | null>(null);
  logoutModalVisible = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Cargamos el usuario y lo asignamos al signal.
      // Asumimos que authService.getUser() devuelve un objeto compatible con UserProfile.
      this.user.set(this.authService.getUser());
    } else {
      // Redirigimos si no está logueado (ejecutado en el cliente)
      this.router.navigate(['/']); 
    }
  }

  /**
   * Método para actualizar un campo específico del objeto usuario almacenado en el Signal.
   * Usamos 'keyof UserProfile' para asegurar que solo se pasen claves válidas
   * como 'name', 'email', 'role' o 'photoUrl'.
   */
  updateUserField(field: keyof UserProfile, value: any) {
    this.user.update(u => ({
      ...u,
      [field]: value
    }));
  }

  // Muestra el modal de confirmación para cerrar sesión
  showLogoutConfirmation() {
    this.logoutModalVisible.set(true);
  }

  // Cierra el modal de confirmación
  cancelLogout() {
    this.logoutModalVisible.set(false);
  }

  // Guarda el perfil y muestra feedback
  saveProfile() {
    // Obtenemos el valor actual del signal tipado
    const updatedUser = this.user(); 
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Mostramos mensaje de éxito en la interfaz
    this.showFeedback('success', '✅ Perfil guardado y actualizado exitosamente.');
    console.log('Datos actualizados:', updatedUser);
  }

  // Cierre de sesión definitivo
  confirmLogout() {
    this.authService.logout();
    this.logoutModalVisible.set(false); // Cerramos el modal
    this.router.navigate(['/']); 
  }

  // Método helper para mostrar feedback temporal
  private showFeedback(type: 'success' | 'danger', text: string) {
    this.feedbackMessage.set({ type, text });
    setTimeout(() => this.feedbackMessage.set(null), 5000);
  }
}