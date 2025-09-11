import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]
}).catch(err => console.error(err));