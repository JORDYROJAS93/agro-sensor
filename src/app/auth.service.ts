import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class AuthService {
  private users = [
    { name: 'Jordy Rojas', email: 'jordy@gmail.com', password: 'admin', role: 'Administrador' },
    { name: 'Admin User', email: 'admin', password: 'admin', role: 'Administrador' },
    { name: 'User Test', email: 'user', password: 'user123', role: 'Agricultor' }
  ];

  private currentUser: any = null;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(email: string, password: string): boolean {
    const found = this.users.find(u => u.email === email && u.password === password);
    if (found) {
      this.currentUser = found;
      localStorage.setItem('user', JSON.stringify(found));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']); // Redirige al login
  }

  getUser(): any {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
