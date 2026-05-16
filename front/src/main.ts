import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
